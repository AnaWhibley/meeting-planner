import { configureStore } from '@reduxjs/toolkit';
import uiStateReducer from './uiStateSlice';
import loginReducer from './login/slice';
import plannerReducer from './planner/slice';
import eventCreatorReducer from './eventCreator/slice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        planner: plannerReducer,
        eventCreator: eventCreatorReducer,
        //events,
        //indisponibilidades
        uiState: uiStateReducer
    },
});

export type RootState = ReturnType<typeof store.getState>