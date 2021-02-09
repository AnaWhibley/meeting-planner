import { configureStore } from '@reduxjs/toolkit';
import uiStateReducer from './uiStateSlice';
import loginReducer from './loginSlice';
import calendarReducer from './calendarSlice';
import eventCreatorReducer from './eventCreator/eventCreatorSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        calendar: calendarReducer,
        eventCreator: eventCreatorReducer,
        //events,
        //indisponibilidades
        uiState: uiStateReducer
    },
});

export type RootState = ReturnType<typeof store.getState>