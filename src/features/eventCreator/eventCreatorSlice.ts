import {createSlice, Dispatch} from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import {RootState} from "../../app/store";
import {requesting} from '../../app/uiStateSlice';
import UserService, {LoginResponse} from '../../services/userService';
import {setUser, showErrorMessage} from '../login/loginSlice';
import EventService, {CreateResponse} from '../../services/eventService';

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
export default slice.reducer;