import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import uiStateReducer from './uiStateSlice';
import loginReducer from './loginSlice';
import calendarReducer from './calendarSlice';
import eventCreatorReducer from './eventCreatorSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        login: loginReducer,
        calendar: calendarReducer,
        eventCreator: eventCreatorReducer,
        //events,
        //indisponibilidades
        uiState: uiStateReducer
    },
});

export type RootState = ReturnType<typeof store.getState>