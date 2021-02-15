import { createSlice } from '@reduxjs/toolkit';

export interface PlannerSlice {
    busyDatesCurrentUser: Array<BusyState>;
    busyDatesOtherUsers: Array<{userId: string, busyDates: Array<BusyState>}>;
}

export interface BusyState {
    id: number;
    start: string;
    end: string;
    allDay: boolean;
}

const busyDatesOtherUsers = [
    {
        userId: '1',
        busyDates: [{
            start: "2021 2 17 08 00 00",
            end: "2021 2 17 15 30 00",
            id: 0.2075701986879172,
            allDay: false,
        }, {
            start: "2021 2 17 17 00 00",
            end: "2021 2 17 18 30 00",
            id: 0.2075701986879176,
            allDay: false
        }]
    }, {
        userId: '2',
        busyDates: [{
            start: "2021 2 15 08 00 00",
            end: "2021 2 15 15 30 00",
            id: 0.2075701986879155,
            allDay: false
        }, {
            start: "2021 2 15 08 00 00",
            end: "2021 2 15 15 30 00",
            id: 0.2075701986879132,
            allDay: false
        }]
    },
    {
        userId: '3',
        busyDates: [{
            start: "2021 2 15 08 00 00",
            end: "2021 2 15 15 30 00",
            id: 0.2075701986875172,
            allDay: false
        }]
    },
];

export const slice = createSlice({
    name: 'planner',
    initialState: {
        busyDatesCurrentUser: [],
        busyDatesOtherUsers: busyDatesOtherUsers
    } as PlannerSlice,
    reducers: {
        addBusy: ((state, action) => {
            state.busyDatesCurrentUser.push({
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