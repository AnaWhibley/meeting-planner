import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../store';
import EventService from '../../services/eventService';

export interface PlannerSlice {
    busyDatesCurrentUser: Array<BusyState>;
    busyDatesOtherUsers: Array<{userId: string, busyDates: Array<BusyState>}>;
    events: Array<any>;
}

export interface BusyState {
    id: string;
    username?: string;
    start: string;
    end: string;
    allDay: boolean;
}

export const slice = createSlice({
    name: 'planner',
    initialState: {
        busyDatesCurrentUser: [],
        busyDatesOtherUsers: [],
        events: []
    } as PlannerSlice,
    reducers: {
        addBusy: ((state, action) => {
            state.busyDatesCurrentUser.push({
                start: action.payload.start,
                end: action.payload.end,
                id: Math.random().toString(),
                allDay: action.payload.allDay
            });
        }),
        deleteBusy: ((state, action) => {
            const index = state.busyDatesCurrentUser.findIndex((date) => date.id === action.payload);
            if(index > -1) state.busyDatesCurrentUser.splice(index, 1);
        }),
        populateBusyDates:((state, action) => {
            state.busyDatesCurrentUser = action.payload.busyDatesCU;
            state.busyDatesOtherUsers = action.payload.busyDatesOU;
        }),
        populateEvents: ((state, action) => {
            state.events = action.payload;
        }),
    },
});

export const { addBusy, deleteBusy, populateBusyDates, populateEvents } = slice.actions;

export const getBusyDates = (userIds: Array<any>) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const currentUser = login.loggedInUser;

    if (currentUser) {
        EventService.getBusyDates(userIds, currentUser).subscribe(busyDates => {
            const { login } = getState();
            const currentUserId = login.loggedInUser?.id;

            const bd = busyDates.reduce((acc: any,current: any) => {
                const newAcc = {busyDatesCU: acc.busyDatesCU, busyDatesOU: acc.busyDatesOU};
                if(current.userId === currentUserId){
                    newAcc.busyDatesCU = current.busyDates;
                } else {
                    newAcc.busyDatesOU = [...acc.busyDatesOU, current]
                }
                return newAcc;
            }, {busyDatesCU: [], busyDatesOU: []});

            dispatch(populateBusyDates(bd));
        })
    }
};

export const getEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const currentUser = login.loggedInUser;
    if (currentUser) {
        EventService.getEvents(currentUser).subscribe(events => {
            dispatch(populateEvents(events));
            let userIds = new Set();
            events.forEach((ev: any) => ev.events.forEach(((e: any)=> e.participants.forEach((p: string) => userIds.add(p)))))
            dispatch(getBusyDates(Array.from(userIds)))
        })
    }
}


export default slice.reducer;