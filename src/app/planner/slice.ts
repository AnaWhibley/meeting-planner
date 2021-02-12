import { createSlice } from '@reduxjs/toolkit';
import {DateTime} from 'luxon';

export interface PlannerSlice {
    busyDates: Array<BusyState>;
}

export interface BusyState {
    id: number;
    start: string;
    end: string;
    allDay: boolean;
}

const createBusyState = (): BusyState => ({
    id: Math.random(),
    start: DateTime.utc().toFormat('ff'),
    end: DateTime.utc().toFormat('ff'),
    allDay: false
});

export const slice = createSlice({
    name: 'planner',
    initialState: {
        busyDates: []
    } as PlannerSlice,
    reducers: {
        addBusy: ((state, action) => {
            state.busyDates.push({
                start: action.payload.start,
                end: action.payload.end,
                id: Math.random(),
                allDay: action.payload.allDay
            });
        })
    },
});

export const { addBusy } = slice.actions;


export default slice.reducer;