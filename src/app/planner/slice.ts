import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../store';
import EventService from '../../services/eventService';

export interface PlannerSlice {
    busyDatesCurrentUser: Array<BusyState>;
    busyDatesOtherUsers: Array<BusyDateState>;
    events: Array<any>;
}

export interface BusyState {
    id?: string;
    start: string;
    end: string;
    allDay: boolean;
}

export interface BusyDateState {
    userId: string;
    userName?: string;
    busy: Array<BusyState>;
}

export const slice = createSlice({
    name: 'planner',
    initialState: {
        busyDatesCurrentUser: [],
        busyDatesOtherUsers: [],
        events: []
    } as PlannerSlice,
    reducers: {
        populateBusyDates:((state, action) => {
            state.busyDatesCurrentUser = action.payload.busyDatesCU;
            state.busyDatesOtherUsers = action.payload.busyDatesOU;
        }),
        populateEvents: ((state, action) => {
            state.events = action.payload;
        }),
    },
});

export const { populateBusyDates, populateEvents } = slice.actions;

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
                    newAcc.busyDatesCU = current.busy;
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

            // No hay que hacer esto si el usuario es un admin
            let userIds = new Set();
            events.forEach((ev: any) => ev.events.forEach(((e: any)=> e.participants.forEach((p: string) => userIds.add(p)))))
            dispatch(getBusyDates(Array.from(userIds)))
        })
    }
}

export const addBusy = (busyDate: BusyState) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const currentUser = login.loggedInUser;
    if (currentUser) {
        EventService.addBusyDate(busyDate, currentUser.id).subscribe(events => {
        });
    }
}

export const deleteBusy = (busyDateId: string) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    EventService.deleteBusyDate(busyDateId).subscribe(events => {
    });
}


export default slice.reducer;