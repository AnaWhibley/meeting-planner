import {createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {DateTime} from 'luxon';
import {RootState} from '../store';
import {validateFields} from './validation';
import {mapToCreateEventRequest, mapJSONToState, mapJSONFromState} from './mappers';
import {getEventService, getUserService} from '../../services/utils';
import {search} from '../../search';
import { v4 as uuidv4 } from 'uuid';
import { creatingEvents } from '../uiStateSlice';

export enum ParticipantType {
    PRESIDENTE_TT = 'Presidente Tribunal Titular',
    SECRETARIO_TT = 'Secretario Tribunal Titular',
    VOCAL_TT = 'Vocal Tribunal Titular',
    PRESIDENTE_TS = 'Presidente Tribunal Suplente',
    SECRETARIO_TS = 'Secretario Tribunal Suplente',
    VOCAL_TS = 'Vocal Tribunal Suplente',
    TUTOR = 'Tutor'
}

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm";
export const TIME_FORMAT = 'HH:mm';

const createDefaultEvent = (): EventState => {
    return {
        id: uuidv4(),
        name: createFieldState(''),
        participants: Object.keys(ParticipantType).map((k: string) => ( { email: createFieldState(''), tag: (ParticipantType as any)[k], confirmed: false })),
        duration: createFieldState(60),
        status: 'pending',
        date: 'pending',
        time: 'pending'
    };
};

const createFieldState = (initialValue: any): FieldState<any> => ({
    value: initialValue,
    errorMessage: '',
});

interface FieldState<T> {
    value: T;
    errorMessage: string;
}

export interface EventState {
    id: string;
    name: FieldState<string>;
    participants: Array<{
        email: FieldState<string>;
        confirmed: boolean;
        tag: string;
    }>;
    duration: FieldState<number>;
    status: string;
    date: string;
    time: string;
    color?: string;
}

export interface EventCreatorSlice {
    stage: number;
    currentIndex: number;
    groupName: FieldState<{
        label: string;
        value: string;
    }>;
    from: FieldState<string>;
    to: FieldState<string>;
    events: Array<EventState>;
}

const getInitialState = () => {
    return {
        stage: 0,
        currentIndex: 0,
        groupName: createFieldState({label: '', value: ''}),
        from: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        to: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        events: [createDefaultEvent()]
    };
};

export const slice = createSlice({
    name: 'eventCreator',
    initialState: getInitialState() as EventCreatorSlice,
    reducers: {
        next: state => {
            const validationHasErrors = validateFields(state);
            if(validationHasErrors) return;

            if(state.events.length > 1 && state.stage === 0 && state.currentIndex !== 0){
                state.stage = 2;
            }else{
                state.stage += 1;
            }
        },
        previous: state => {
            state.stage -= 1;
        },
        setName: (state, action) => {
            state.events[state.currentIndex].name.value = action.payload;
        },
        setDuration: (state, action) => {
            state.events[state.currentIndex].duration.value = action.payload;
        },
        setFrom: (state, action) => {
            state.from.value = action.payload;
        },
        setTo: (state, action) => {
            state.to.value = action.payload;
        },
        setParticipants: (state, action) => {
            const index = action.payload.index;
            state.events[state.currentIndex].participants[index] = {
                ...state.events[state.currentIndex].participants[index],
                email: {
                    value: action.payload.value,
                    errorMessage: ''
                }
            };
        },
        setGroupName: (state, action) => {
            state.groupName.value = action.payload;
        },
        addTutor: (state) => {
            state.events[state.currentIndex].participants.push({email: createFieldState(''), tag: 'Tutor', confirmed: false});
        },
        removeTutor: (state) => {
            state.events[state.currentIndex].participants.pop();
        },
        createNew: (state) => {
            state.events = [...state.events, createDefaultEvent()];
            state.currentIndex = state.currentIndex + 1;
            state.stage = 0;
        },
        createEventsCompleted: (state) => {
            state.stage = 4;
        },
        setImportedData: (state,action) => {
            state.events = action.payload.events;
            state.groupName = createFieldState(action.payload.groupName);
            state.from = createFieldState(action.payload.from);
            state.to = createFieldState(action.payload.to);
            state.stage = 3;
        },
        editEvent: (state,action: PayloadAction<{stage?: number, currentIndex: number}>) => {
            state.stage = action.payload.stage !== undefined ? action.payload.stage : 0;
            state.currentIndex = action.payload.currentIndex;
        },
        setInitialState: (state) => {
            return getInitialState();
        },
    },
});

export const { next, previous, setFrom, setTo, setName, createNew, createEventsCompleted, setParticipants, addTutor, removeTutor, setImportedData, setGroupName, setDuration, editEvent, setInitialState } = slice.actions;

export const createEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(creatingEvents());

    const { eventCreator, planner } = getState();
    const groupedEvent = mapToCreateEventRequest(eventCreator);

    const newData = search(groupedEvent, planner.busyDatesOtherUsers);

    groupedEvent.events = newData.events;

    getEventService().updateBusyDates(newData.busyDates).subscribe((busyDatesResponse) => {
        getEventService().createGroupedEvent(groupedEvent).subscribe((groupedEventResponse) => {
            getUserService().createUsers(groupedEvent.events).subscribe((createUsersResponse) => {
                if(busyDatesResponse && groupedEventResponse && createUsersResponse) {
                    dispatch(createEventsCompleted());
                }
            })
        })
    });
};

export const exportJSON = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const data = JSON.stringify(mapJSONFromState(state));
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);

    let link: HTMLAnchorElement | null = document.createElement('a');
    if(link.download !== undefined) {
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'temp.json');
        link.click();
        link = null;
    }
};

export const importJSON = (files: any) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const fr = new FileReader();
    if(files.length <= 0) return false;
    fr.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        dispatch(setImportedData(mapJSONToState(data)));
    }
    fr.readAsText(files[0]);
};

export default slice.reducer;
