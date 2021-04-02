import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {BusyDateDto, GroupedEventDto} from '../../services/eventService';
import {Role} from '../../services/userService';
import {User} from '../login/slice';
import {getEventService, getUserService, ServiceResponse} from "../../services/utils";
import {search} from '../../search';
import {DateTime, Interval} from 'luxon';
import {DATE_FORMAT, DATE_TIME_FORMAT} from '../eventCreator/slice';
import {deleteEventCompleted, deleteGroupedEventCompleted, requesting } from '../uiStateSlice';

export interface PlannerSlice {
    busyDatesCurrentUser: Array<BusyState>;
    busyDatesOtherUsers: Array<BusyDateState>;
    events: Array<GroupedEventDto>;
    participants: Array<User>;
    selectedParticipants: Array<string>;
    selectedEvents: Array<Array<string>>;
    isSelectedParticipantsInitialized: boolean;
}

export interface BusyDateState {
    userId: string;
    busy: Array<BusyState>;
}

export interface BusyState {
    id: string;
    start: string;
    end: string;
    allDay: boolean;
    eventId?: string;
}

export const slice = createSlice({
    name: 'planner',
    initialState: {
        busyDatesCurrentUser: [],
        busyDatesOtherUsers: [],
        events: [],
        participants: [],
        selectedParticipants: [],
        selectedEvents: [],
        isSelectedParticipantsInitialized: false
    } as PlannerSlice,
    reducers: {
        populateBusyDates:(state, action) => {
            state.busyDatesCurrentUser = action.payload.busyDatesCU;
            state.busyDatesOtherUsers = action.payload.busyDatesOU;
        },
        populateEvents: (state, action) => {
            state.events = action.payload;
            state.selectedEvents = action.payload.map((groupedEvent: GroupedEventDto) => groupedEvent.events.map(event => event.id));
        },
        populateParticipants: (state, action) => {
            state.participants = action.payload.participants;
            if(!state.isSelectedParticipantsInitialized){
                state.selectedParticipants = action.payload.selectedParticipants.map((u: User) => u.id);
                state.isSelectedParticipantsInitialized = true;
            }
        },
        setSelectedParticipants: (state, action) => {
            const currentIndex = state.selectedParticipants.indexOf(action.payload);
            const newSelectedParticipants = [...state.selectedParticipants];

            if (currentIndex === -1) {
                newSelectedParticipants.push(action.payload);
            } else {
                newSelectedParticipants.splice(currentIndex, 1);
            }

            state.selectedParticipants = newSelectedParticipants;
        },
        setSelectedEvents: (state, action) => {
            const currentIndex = state.selectedEvents[action.payload.groupId].indexOf(action.payload.eventId);
            const newSelectedEvents = [...state.selectedEvents];

            if (currentIndex === -1) {
                newSelectedEvents[action.payload.groupId].push(action.payload.eventId);
            } else {
                newSelectedEvents[action.payload.groupId].splice(currentIndex, 1);
            }

            state.selectedEvents = newSelectedEvents;
        },
        toggleSelectAllEvents: (state, action) => {
            const groupedEvents = state.events.slice();
            const isAllSelected = groupedEvents[action.payload.groupIndex].events.length === state.selectedEvents[action.payload.groupIndex].length;
            if(isAllSelected) {
                state.selectedEvents[action.payload.groupIndex] = [];
            }else{
                state.selectedEvents[action.payload.groupIndex] = groupedEvents[action.payload.groupIndex].events.map(event => event.id);
            }
        },
        toggleSelectAllParticipants: (state, action) => {
            let participants = state.participants.slice().map(user => user.id);

            if(action.payload === Role.ADMIN) {
                const busyDatesOU = state.busyDatesOtherUsers;
                participants = participants.filter(p => {
                    const busyDates = busyDatesOU.find(bd => bd.userId === p);
                    if(busyDates) return busyDates.busy.length > 0;
                    return false;
                });
            }
            const isAllSelected = participants.length === state.selectedParticipants.length;

            if(isAllSelected) {
                state.selectedParticipants = [];
            }else{
                state.selectedParticipants = participants;
                console.log(state.selectedParticipants)
            }
        },
    },
});

export const { populateBusyDates, populateEvents, populateParticipants, setSelectedParticipants, setSelectedEvents,
    toggleSelectAllEvents, toggleSelectAllParticipants } = slice.actions;

export const getEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    //dispatch(requesting());
    const { login } = getState();
    const currentUser = login.loggedInUser;
    // Get grouped events in which user participates (for admin get all events)
    getEventService().getEvents(currentUser).subscribe((response: ServiceResponse<Array<GroupedEventDto>>) => {
        if(response.success){
            dispatch(populateEvents(response.data));

            if(currentUser.role === Role.ADMIN){
                dispatch(getBusyDatesAdmin())
            }else{
                dispatch(getBusyDates(getParticipantsId(response.data)));
            }
        }
    })
};

const getParticipantsId = (events: Array<GroupedEventDto>): Array<string> => {
    const userIds: Set<string> = new Set();
    events.forEach((ev: GroupedEventDto) => ev.events.forEach(((e)=> e.participants.forEach((p) => userIds.add(p.email)))))
    return Array.from(userIds);
};

const getBusyDates = (userIds: Array<string>) => (dispatch: Dispatch<any>, getState: () => RootState) => {

    if(userIds.length > 0) {

        getUserService().getParticipants(userIds).subscribe((response: ServiceResponse<Array<User>>) => {
            if(response.success) dispatch(populateParticipants({participants: response.data, selectedParticipants: response.data}));
        });

        getEventService().getBusyDates(userIds).subscribe((response: ServiceResponse<Array<BusyDateDto>>) => {
            if(response.success) {
                const { login } = getState();
                dispatch(populateBusyDates(filterBusyDatesByCurrentUser(response.data, login.loggedInUser.id)));
            }
        });
    }
};

const filterBusyDatesByCurrentUser = (busyDates: Array<BusyDateDto>, currentUserId: string) => {
    return busyDates.reduce((acc: any,current: any) => {
        const newAcc = {busyDatesCU: acc.busyDatesCU, busyDatesOU: acc.busyDatesOU};
        if(current.userId === currentUserId){
            newAcc.busyDatesCU = current.busy;
        } else {
            newAcc.busyDatesOU = [...acc.busyDatesOU, current]
        }
        return newAcc;
    }, {busyDatesCU: [], busyDatesOU: []});
}

const getBusyDatesAdmin = () => (dispatch: Dispatch<any>) => {
    getEventService().getBusyDates().subscribe(busyDates => {
        getUserService().getParticipants().subscribe((participants) => {
            if(participants.success && busyDates.success){
                const busyDatesOU = busyDates.data;
                const bd = {busyDatesCU: [], busyDatesOU};
                dispatch(populateBusyDates(bd));

                const selectedParticipants = participants.data.filter(p => {
                    const busyDates = busyDatesOU.find(bd => bd.userId === p.id);
                    if(busyDates) return busyDates.busy.length > 0;
                    return false;
                });
                dispatch(populateParticipants({participants: participants.data, selectedParticipants}));
            }
        });
    });
};

export const addBusy = (busyDate: BusyState) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const newBusy = deleteBusyDateForEvents(getState());
    const index = newBusy.findIndex(busyDate => busyDate.userId === login.loggedInUser.id);
    if(index > -1){
        newBusy[index] = {
            ...newBusy[index],
            busy: [...newBusy[index].busy, busyDate]
        }
    }
    searchSlotsEvents(getState(), newBusy, busyDate);
};

export const deleteBusy = (busyDate: BusyState) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const currentUser = login.loggedInUser;
    if (currentUser) {
        const newBusy = deleteBusyDateForEvents(getState());
        const index = newBusy.findIndex(busyDate => busyDate.userId === currentUser.id);
        if(index > -1){
            const indexBusyToDelete = newBusy[index].busy.findIndex(busy => busy.id === busyDate.id);
            if(indexBusyToDelete > -1){
                newBusy[index].busy.splice(indexBusyToDelete, 1);
            }
        }
        searchSlotsEvents(getState(), newBusy, busyDate);
    }
};

const searchSlotsEvents = (state: RootState, busyDates: Array<BusyDateState>, busyDate: BusyState) => {
    const start = DateTime.fromFormat(busyDate.start, DATE_TIME_FORMAT);
    const end = DateTime.fromFormat(busyDate.end, DATE_TIME_FORMAT);
    const interval = Interval.fromDateTimes(start, end);

    state.planner.events.forEach(ev => {
        const groupedEvStart = DateTime.fromFormat(ev.from, DATE_FORMAT);
        const groupedEvEnd = DateTime.fromFormat(ev.to, DATE_FORMAT);
        const evInterval = Interval.fromDateTimes(groupedEvStart, groupedEvEnd);
        if(interval.overlaps(evInterval)) {
            const newData = search(ev, busyDates);
            getEventService().updateBusyDates(newData.busyDates).subscribe((response) => {});
            getEventService().updateEventsFromGroupedEvent(newData.events, ev.groupName).subscribe((response) => {});
        }
    })
};

export const deleteBusyDateForEvents = (state: RootState): Array<BusyDateState> => {

    const { planner, login } = state;

    const newBusyDatesOtherUsers = planner.busyDatesOtherUsers.map((busyDate) => ({
        ...busyDate,
        busy: filterBusyDates(state, busyDate.busy)
    }));

    if(login.loggedInUser.role === Role.ADMIN){
        return [...newBusyDatesOtherUsers];
    }

    const newBusyDatesCurrentUser = filterBusyDates(state, planner.busyDatesCurrentUser);

    return [...newBusyDatesOtherUsers, {userId: login.loggedInUser.id || '', busy: newBusyDatesCurrentUser}];
};

const filterBusyDates = (state: RootState, busyDates: Array<BusyState>): Array<BusyState> => {
    return busyDates.filter(x => {
        const events = state.planner.events.slice().flatMap((groupedEvent: GroupedEventDto) => groupedEvent.events.map(event => event.id));
        const eventDetails = state.planner.events.slice().flatMap((groupedEvent: GroupedEventDto) => groupedEvent.events.find((event) => event.id === x.eventId)).filter(x => !!x)[0];
        if(eventDetails && eventDetails.status === 'confirmed') {
            return x;
        }else if(x.eventId && !events.includes(x.eventId)){
            return x;
        }else{
            return !x.eventId;
        }
    });
}

export const deleteGroupedEvent = (groupName: string) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    getEventService().deleteGroupedEvent(groupName).subscribe((response) => {
        if(response) dispatch(deleteGroupedEventCompleted());
    });
};

export const deleteEvent = (groupEventName: string, eventId: string) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    getEventService().deleteEvent(groupEventName, eventId).subscribe((response) => {
        if(response) dispatch(deleteEventCompleted());
    });
};

export default slice.reducer;
