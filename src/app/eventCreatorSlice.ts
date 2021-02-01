import {createSlice, Dispatch} from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import {RootState} from './store';
import {requesting} from './uiStateSlice';
import EventService, {CreateResponse} from '../services/eventService';

const createDefaultState = () => {
    return {
        id: Math.random(),
        groupName: 'default',
        name: createFieldState(''),
        from: createFieldState(DateTime.utc().toSeconds()),
    };
};

const createFieldState = (initialValue: any) => ({
    value: initialValue,
    errorMessage: '',
});

export const slice = createSlice({
    name: 'eventCreator',
    initialState: {
        stage: 0,
        currentIndex: 0,
        events: [createDefaultState()]
    },
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
        setFrom: (state, action) => {
            state.events[state.currentIndex].from.value = action.payload;
        },
        createNew: (state) => {
            state.events = [...state.events, createDefaultState()];
            state.currentIndex = state.currentIndex + 1;
            state.stage = 0;
        },
        complete: (state) => {
            state.events = [createDefaultState()];
            state.stage = 0;
            state.currentIndex = 0;
        },
    },
});

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
        console.log("!!!! e", e);
        const data = JSON.parse(e.target.result);
        console.log("!!!! data", data);
    }
    fr.readAsText(files[0]);
};

export const { next, previous, setFrom, setName, createNew, complete } = slice.actions;

export const selectStage = (state: RootState) => state.eventCreator.stage;
export const selectName = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].name;
export const selectFrom = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].from;
export const selectIsLastStage = (state: RootState) => state.eventCreator.stage === 2;


const mapEvents = (events: Array<any>) => {
    return events.map((event) => {
        return {
            id: event.id,
            groupName: event.groupName,
            name: event.name.value,
            from: event.from.value
        };
    });
};

const mapStateToJSON = (state: RootState) => {
    return {
        user: state.login.username,
        events: mapEvents(state.eventCreator.events)
    };
};

export default slice.reducer;