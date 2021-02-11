import {createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {DateTime} from 'luxon';
import {RootState} from '../store';
import {requesting} from '../uiStateSlice';
import EventService, {CreateResponse} from '../../services/eventService';
import {validateFields} from './validation';
import {mapEvents, mapJSONToState, mapStateToJSON} from './mappers';

export enum ParticipantType {
    PRESIDENTE_TT = 'Presidente Tribunal Titular',
    SECRETARIO_TT = 'Secretario Tribunal Titular',
    VOCAL_TT = 'Vocal Tribunal Titular',
    PRESIDENTE_TS = 'Presidente Tribunal Suplente',
    SECRETARIO_TS = 'Secretario Tribunal Suplente',
    VOCAL_TS = 'Vocal Tribunal Suplente',
    TUTOR = 'Tutor'
}

export const DATE_FORMAT = 'dd-MM-yyyy';

const createDefaultEvent = (): EventState => {
    return {
        id: Math.random(),
        name: createFieldState(''),
        participants: Object.keys(ParticipantType).map((k: string) => ( { email: createFieldState(''), tag: (ParticipantType as any)[k] })),
        duration: createFieldState(60)
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
    id: number;
    name: FieldState<string>;
    participants: Array<{
        email: FieldState<string>;
        tag: string;
    }>;
    duration: FieldState<number>;
}

export interface EventCreatorState {
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

export const slice = createSlice({
    name: 'eventCreator',
    initialState: {
        stage: 0,
        currentIndex: 0,
        groupName: createFieldState({label: '', value: ''}),
        from: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        to: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        events: [createDefaultEvent()]
    } as EventCreatorState,
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
            state.events[state.currentIndex].participants.push({email: createFieldState(''), tag: 'Tutor'});
        },
        removeTutor: (state) => {
            state.events[state.currentIndex].participants.pop();
        },
        createNew: (state) => {
            state.events = [...state.events, createDefaultEvent()];
            state.currentIndex = state.currentIndex + 1;
            state.stage = 0;
        },
        complete: (state) => {
            state.stage = 4;
            state.events = [createDefaultEvent()];
            state.from = createFieldState(DateTime.utc().toFormat(DATE_FORMAT));
            state.to = createFieldState(DateTime.utc().toFormat(DATE_FORMAT));
            state.currentIndex = 0;
            state.groupName = createFieldState({label: '', value: ''});
        },
        setImportedData: (state,action) => {
            state.events = action.payload.events;
            state.groupName = action.payload.groupName;
            state.from = action.payload.from;
            state.to = action.payload.to;
            state.stage = 3;
        },
        editEvent: (state,action: PayloadAction<{stage?: number, currentIndex: number}>) => {
            state.stage = action.payload.stage !== undefined ? action.payload.stage : 0;
            state.currentIndex = action.payload.currentIndex;
        },
    },
});

export const { next, previous, setFrom, setTo, setName, createNew, complete, setParticipants, addTutor, removeTutor, setImportedData, setGroupName, setDuration, editEvent } = slice.actions;

export const createEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { eventCreator } = getState();
    EventService.create(mapEvents(eventCreator.events)).subscribe((response: CreateResponse) => {
        if(response.success){
            dispatch(complete());
        }
    });
};

export const exportJSON = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const data = JSON.stringify(mapStateToJSON(state));
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);

    let link: any = document.createElement('a');
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