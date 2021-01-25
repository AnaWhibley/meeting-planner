import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import uiStateReducer from './uiStateSlice';
import loginReducer from "../features/login/loginSlice";
import calendarReducer from "../features/calendar/calendarSlice"

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        login: loginReducer,
        calendar: calendarReducer,
        //events,
        //indisponibilidades
        uiState: uiStateReducer
    },
});

export type RootState = ReturnType<typeof store.getState>