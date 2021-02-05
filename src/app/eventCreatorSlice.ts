import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {DateTime} from 'luxon';
import {RootState} from './store';
import {requesting} from './uiStateSlice';
import EventService, {CreateResponse} from '../services/eventService';

enum ParticipantType {
    PRESIDENTE_TT = 'Presidente Tribunal Titular',
    SECRETARIO_TT = 'Secretario Tribunal Titular',
    VOCAL_TT = 'Vocal Tribunal Titular',
    PRESIDENTE_TS = 'Presidente Tribunal Suplente',
    SECRETARIO_TS = 'Secretario Tribunal Suplente',
    VOCAL_TS = 'Vocal Tribunal Suplente',
    TUTOR = 'Tutor'
}
export const DATE_FORMAT = 'dd-MM-yyyy';
const createDefaultEvent = () => {
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

interface EventCreatorState {
    stage: number;
    currentIndex: number;
    groupName?: {
        label: string;
        value: string;
    };
    from: FieldState<string>;
    to: FieldState<string>;
    events: Array<{
        id: number;
        name: FieldState<string>;
        participants: Array<{
            email: FieldState<string>;
            tag: string;
        }>;
        duration: FieldState<number>;
    }>;
}

export const slice = createSlice({
    name: 'eventCreator',
    initialState: {
        stage: 0,
        currentIndex: 0,
        from: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        to: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        events: [createDefaultEvent()]
    } as EventCreatorState,
    reducers: {
        next: state => {
            state.stage += 1;
        },
        previous: state => {
            state.stage -= 1;
        },
        setName: (state, action) => {
            state.events[state.currentIndex].name.value = action.payload;
            if (action.payload.length < 3) {
                state.events[state.currentIndex].name.errorMessage = 'Too short'
            } else {
                state.events[state.currentIndex].name.errorMessage = ''
            }
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
            state.groupName = action.payload;
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
            state.events = [createDefaultEvent()];
            state.groupName = undefined;
            state.stage = 0;
            state.currentIndex = 0;
        },
        setImportedData: (state,action) => {
            state.events = action.payload;
            state.stage = 3;
        },
    },
});

export const { next, previous, setFrom, setTo, setName, createNew, complete, setParticipants, addTutor, removeTutor, setImportedData, setGroupName, setDuration } = slice.actions;

export const createEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { eventCreator } = getState();
    EventService.create(mapEvents(eventCreator.events)).subscribe((response: CreateResponse) => {
        if(response.success){
            dispatch(complete())
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
    console.log(files);
    if(files.length <= 0) return false;
    fr.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        dispatch(setImportedData(data.events.map((d: any) => {
            return {
                ...d,
                name: {value: d.name},
            }
        })));
    }
    fr.readAsText(files[0]);
};

export const selectStage = (state: RootState) => state.eventCreator.stage;
export const selectGroupName = (state: RootState) => state.eventCreator.groupName;
export const selectParticipants = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].participants;
export const selectName = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].name;
export const selectDuration = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].duration;
export const selectFrom = (state: RootState) => state.eventCreator.from;
export const selectTo = (state: RootState) => state.eventCreator.to;
export const selectIsLastStage = (state: RootState) => state.eventCreator.stage === 3;
export const selectIsFirstStage = (state: RootState) => state.eventCreator.stage === 0;
export const selectTutorNumber = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].participants.reduce((acc, current) => {
    let newAcc = acc;
    if(current.tag === ParticipantType.TUTOR) newAcc += 1;
    return newAcc;
}, 0);

const mapEvents = (events: Array<any>) => {
    return events.map((event) => {
        return {
            id: event.id,
            groupName: event.groupName,
            name: event.name.value,
        };
    });
};

const mapStateToJSON = (state: RootState) => {
    return {
        user: state.login.username,
        events: mapEvents(state.eventCreator.events),
        from: state.eventCreator.from.value,
        to: state.eventCreator.to.value
    };
};

export default slice.reducer;