import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../store';
import EventService, {GroupedEventDto} from '../../services/eventService';
import UserService, {Role} from '../../services/userService';
import {User} from '../login/slice';

export interface PlannerSlice {
    busyDatesCurrentUser: Array<BusyState>;
    busyDatesOtherUsers: Array<BusyDateState>;
    events: Array<GroupedEventDto>;
    participants: Array<User>;
    selectedParticipants: Array<string>;
}

export interface BusyDateState {
    userId: string;
    busy: Array<BusyState>;
}

export interface BusyState {
    id?: string;
    start: string;
    end: string;
    allDay: boolean;
}

export const slice = createSlice({
    name: 'planner',
    initialState: {
        busyDatesCurrentUser: [],
        busyDatesOtherUsers: [],
        events: [],
        participants: [],
        selectedParticipants: []
    } as PlannerSlice,
    reducers: {
        populateBusyDates:((state, action) => {
            state.busyDatesCurrentUser = action.payload.busyDatesCU;
            state.busyDatesOtherUsers = action.payload.busyDatesOU;
        }),
        populateEvents: ((state, action) => {
            state.events = action.payload;
        }),
        populateParticipants: ((state, action) => {
            state.participants = action.payload;
            state.selectedParticipants = action.payload.map((u: User) => u.id);
        }),
        setSelectedParticipants: ((state, action) => {
            const currentIndex = state.selectedParticipants.indexOf(action.payload);
            const newSelectedParticipants = [...state.selectedParticipants];

            if (currentIndex === -1) {
                newSelectedParticipants.push(action.payload);
            } else {
                newSelectedParticipants.splice(currentIndex, 1);
            }

            state.selectedParticipants = newSelectedParticipants;
        })
    },
});

export const { populateBusyDates, populateEvents, populateParticipants, setSelectedParticipants } = slice.actions;

export const getBusyDates = (userIds?: Array<string>) => (dispatch: Dispatch<any>, getState: () => RootState) => {

    if(!userIds) {
        // Admin
        EventService.getBusyDates().subscribe(busyDates => {
            UserService.getNameOfParticipants().subscribe(participants => {
                dispatch(populateParticipants(participants));
                const bd = {busyDatesCU: [], busyDatesOU: busyDates};
                dispatch(populateBusyDates(bd));
            })
        })
    }else{
        // User
        EventService.getBusyDates(userIds).subscribe(busyDates => {
            UserService.getNameOfParticipants(userIds).subscribe(participants => {
                console.log(busyDates, participants)
                dispatch(populateParticipants(participants));
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
        })
    }
};

export const getEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const currentUser = login.loggedInUser;
    if (currentUser) {
        EventService.getEvents(currentUser).subscribe(events => {
            dispatch(populateEvents(events));
            if(currentUser.role === Role.USER){
                const userIds: Set<string> = new Set();
                events.forEach((ev: GroupedEventDto) => ev.events.forEach(((e)=> e.participants.forEach((p) => userIds.add(p.email)))))
                dispatch(getBusyDates(Array.from(userIds)))
            }else{
                dispatch(getBusyDates())
            }
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