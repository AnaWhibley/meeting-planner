import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {RootState} from '../store';
import EventService, {BusyDateDto, BusyDto, GroupedEventDto} from '../../services/eventService';
import {Role} from '../../services/userService';
import {User} from '../login/slice';
import {getUserService} from "../../services/utils";
import {requesting} from '../uiStateSlice';
import {search} from '../../search';
import {DateTime, Interval} from 'luxon';
import {DATE_FORMAT, DATE_TIME_FORMAT} from '../eventCreator/slice';
import {delay} from 'rxjs/operators';

export interface PlannerSlice {
    busyDatesCurrentUser: Array<BusyState>;
    busyDatesOtherUsers: Array<BusyDateState>;
    events: Array<GroupedEventDto>;
    participants: Array<User>;
    selectedParticipants: Array<string>;
    selectedEvents: Array<Array<string>>;
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
        selectedEvents: []
    } as PlannerSlice,
    reducers: {
        populateBusyDates:(state, action) => {
            console.log(action.payload.busyDatesCU);
            state.busyDatesCurrentUser = action.payload.busyDatesCU;
            state.busyDatesOtherUsers = action.payload.busyDatesOU;
        },
        populateEvents: (state, action) => {
            state.events = action.payload;
            state.selectedEvents = action.payload.map((groupedEvent: GroupedEventDto) => groupedEvent.events.map(event => event.id));
        },
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
        }),
        setSelectedEvents: ((state, action) => {
            const currentIndex = state.selectedEvents[action.payload.groupId].indexOf(action.payload.eventId);
            const newSelectedEvents = [...state.selectedEvents];

            if (currentIndex === -1) {
                newSelectedEvents[action.payload.groupId].push(action.payload.eventId);
            } else {
                newSelectedEvents[action.payload.groupId].splice(currentIndex, 1);
            }

            state.selectedEvents = newSelectedEvents;
        }),
        toggleSelectAllEvents: ((state, action) => {
            const groupedEvents = state.events.slice();
            const isAllSelected = groupedEvents[action.payload.groupIndex].events.length === state.selectedEvents[action.payload.groupIndex].length;
            if(isAllSelected) {
                state.selectedEvents[action.payload.groupIndex] = [];
            }else{
                state.selectedEvents[action.payload.groupIndex] = groupedEvents[action.payload.groupIndex].events.map(event => event.id);
            }
        }),
        toggleSelectAllParticipants: ((state) => {
            const participants = state.participants.slice().map(user => user.id);
            const isAllSelected = participants.length === state.selectedParticipants.length;
            if(isAllSelected) {
                state.selectedParticipants = [];
            }else{
                state.selectedParticipants = participants;
            }
        }),
    },
});

export const { populateBusyDates, populateEvents, populateParticipants, setSelectedParticipants, setSelectedEvents,
    toggleSelectAllEvents, toggleSelectAllParticipants } = slice.actions;

export const getEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { login } = getState();
    const currentUser = login.loggedInUser;
    if (currentUser) {
        // Get grouped events in which user participates (for admin get all events)
        EventService.getEvents(currentUser).subscribe((groupedEvents: Array<GroupedEventDto>) => {
            dispatch(populateEvents(groupedEvents));

            if(groupedEvents.length > 0) {
                if(currentUser.role === Role.ADMIN){
                    dispatch(getBusyDatesAdmin())
                }else{
                    dispatch(getBusyDates(getParticipantsId(groupedEvents)));
                }
            }
        })
    }
};

const getParticipantsId = (events: Array<GroupedEventDto>): Array<string> => {
    const userIds: Set<string> = new Set();
    events.forEach((ev: GroupedEventDto) => ev.events.forEach(((e)=> e.participants.forEach((p) => userIds.add(p.email)))))
    return Array.from(userIds);
};

const getBusyDates = (userIds: Array<string>) => (dispatch: Dispatch<any>, getState: () => RootState) => {

    if(userIds.length === 0) {
        //show message there are not busy dates to show
        console.log('there are not busy dates to show');
    }else{
        EventService.getBusyDates(userIds).subscribe((busyDates) => {
            console.log("getBusyDates...", busyDates);
            getUserService().getParticipants(userIds).subscribe((response) => {
                if(response) {
                    dispatch(populateParticipants(response));

                    const { login } = getState();
                    const currentUser = login.loggedInUser;
                    if(currentUser) {
                        dispatch(populateBusyDates(filterBusyDatesByCurrentUser(busyDates, currentUser.id)));
                    }
                }
            })
        })
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
    EventService.getBusyDates().subscribe(busyDates => {
        getUserService().getParticipants().subscribe(response => {
            if(response){
                dispatch(populateParticipants(response));
                const bd = {busyDatesCU: [], busyDatesOU: busyDates};
                dispatch(populateBusyDates(bd));
            }
        })
    })
};

export const addBusy = (busyDate: BusyState) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { login } = getState();
    const currentUser = login.loggedInUser;
    if (currentUser) {
        EventService.addBusyDate(busyDate, currentUser.id).pipe(delay(1000)).subscribe(events => {
            searchSlotsEvents(getState(), busyDate);
        });
    }
};

export const deleteBusy = (busyDate: BusyDto) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    if (busyDate.id){
        EventService.deleteBusyDate(busyDate.id).pipe(delay(1000)).subscribe(events => {
            console.log('2 !!!', getState());
            searchSlotsEvents(getState(), busyDate);
        });
    }
};

const searchSlotsEvents = (state: RootState, busyDate: BusyState) => {
    const start = DateTime.fromFormat(busyDate.start, DATE_TIME_FORMAT);
    const end = DateTime.fromFormat(busyDate.end, DATE_TIME_FORMAT);
    const interval = Interval.fromDateTimes(start, end);

    state.planner.events.forEach(ev => {
        const groupedEvStart = DateTime.fromFormat(ev.from, DATE_FORMAT);
        const groupedEvEnd = DateTime.fromFormat(ev.to, DATE_FORMAT);
        const evInterval = Interval.fromDateTimes(groupedEvStart, groupedEvEnd);
        if(interval.overlaps(evInterval)) {
            const busyDates: any = [...state.planner.busyDatesOtherUsers, {userId: state.login.loggedInUser?.id, busy: state.planner.busyDatesCurrentUser}];
            const newData = search(ev, busyDates, undefined, state.login.loggedInUser?.id);
            EventService.updateBusyDate(newData.busyDates).subscribe(events => {
                EventService.updateEventsFromGroupedEvent(newData.events, ev.groupName).subscribe((data) => {

                });
            });
        }
    })
};

const isOverlappingWith = (state: RootState, start: DateTime, end: DateTime) => {
    const newInterval = Interval.fromDateTimes(start, end);

    const filteredBusyDatesCurrentUser = state.planner.busyDatesCurrentUser.filter(busyDate => busyDate.eventId !== undefined);
    const filteredBusyDatesOtherUsers = state.planner.busyDatesOtherUsers.flatMap(busyDate => busyDate.busy.filter(busy => busy.eventId !== undefined));
    const filteredBusyDates = filteredBusyDatesCurrentUser.concat(filteredBusyDatesOtherUsers)
    const overlappedEvents: any = [];
    filteredBusyDates.forEach(bd => {
        const bdInterval = Interval.fromDateTimes(DateTime.fromFormat(bd.start, DATE_TIME_FORMAT), DateTime.fromFormat(bd.end, DATE_TIME_FORMAT));
        if(bdInterval.overlaps(newInterval)) {
            overlappedEvents.push(bd.eventId);
        }
    });
    return overlappedEvents;
}

export const deleteBusyDateForEvents = (start: DateTime, end: DateTime) => (dispatch: Dispatch<any>, getState: () => RootState) => {

    const { planner, login } = getState();
    const newBusyDatesCurrentUser =  planner.busyDatesCurrentUser.filter(x => !x.eventId);
    const newBusyDatesOtherUsers = planner.busyDatesOtherUsers.map((busyDate) => ({
        ...busyDate,
        busy: busyDate.busy.filter(x => !x.eventId)
    }));

    const newBusyDates: any = [...newBusyDatesOtherUsers, {userId: login.loggedInUser?.id, busy: newBusyDatesCurrentUser}];

    EventService.updateBusyDate(newBusyDates).subscribe(events => {

    });

};

export default slice.reducer;
