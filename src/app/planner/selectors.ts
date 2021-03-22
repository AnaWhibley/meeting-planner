import {RootState} from '../store';
import {BusyState} from './slice';
import {DateTime} from 'luxon';
import {DATE_TIME_FORMAT} from '../eventCreator/slice';
import {Role} from '../../services/userService';
import {EventDto, GroupedEventDto} from '../../services/eventService';

export const selectBusyDatesCurrentUser = (state: RootState) => state.planner.busyDatesCurrentUser.map((date: BusyState) => {

    const event = findEventById(state, date.eventId);

    return {
        ...date,
        start: getJSDateFromString(date.start),
        end: getJSDateFromString(date.end),
        title: date.eventId ? event?.name + ' está programado' : 'Estás ocupado/a',
        color: date.eventId ? '#8fbdef' : '#2896ff',
        textColor: 'black',
        canDelete: !date.eventId,
        groupId: 'currentUser'
    }
});
export const selectBusyDatesOtherUsers = (state: RootState) => state.planner.busyDatesOtherUsers.filter((user) => state.planner.selectedParticipants.includes(user.userId)).flatMap((user) => {

    const u = state.planner.participants.find(participant => participant.id === user.userId);

    return user.busy.map((date: BusyState) => {
        const event = findEventById(state, date.eventId);

        return {
            ...date,
            start: getJSDateFromString(date.start),
            end: getJSDateFromString(date.end),
            textColor: 'black',
            color: u?.color,
            title: date.eventId ? u?.name + ' tiene programado el evento ' + event?.name : u?.name + ' está ocupado/a',
            canDelete: false,
        }
    });
});

export const selectParticipants = (state: RootState) => state.planner.participants.filter(p => {
    const busyDatesOU = state.planner.busyDatesOtherUsers.find(bd => bd.userId === p.id);
    if(busyDatesOU) {
        return busyDatesOU.busy.length > 0
    }
    return false;
});

export const selectSelectedParticipants = (state: RootState) => state.planner.selectedParticipants;
export const selectSelectedEvents = (state: RootState) => state.planner.selectedEvents;

export const selectEvents = (state: RootState) => state.planner.events;

export const selectEventsFiltered = (state: RootState) => {
    const busyDates = state.login.loggedInUser?.role === Role.ADMIN ? state.planner.busyDatesOtherUsers.slice().flatMap(busyDate => busyDate.busy.filter(busy => busy.eventId)) : state.planner.busyDatesCurrentUser.slice().filter(busy => busy.eventId);
    const eventMap = new Map();
    busyDates.forEach(ev => {
        if(!eventMap.has(ev.eventId)) {
            const eventDetails = findEventById(state, ev.eventId);
            const eventWithProperties = {
                ...ev,
                start: getJSDateFromString(ev.start),
                end: getJSDateFromString(ev.end),
                textColor: 'black',
                color: eventDetails?.color,
                canDelete: false,
                title: eventDetails?.name,
                status: eventDetails?.status
            };
            eventMap.set(ev.eventId, eventWithProperties);
        }
    });
    const selectedEvents = state.planner.selectedEvents.slice().flatMap((event) => event);
    return Array.from(eventMap.values()).filter(event => selectedEvents.includes(event.eventId));
};

const getJSDateFromString = (date: string): Date => DateTime.fromFormat(date, DATE_TIME_FORMAT, {zone: 'UTC'}).toJSDate();

const findEventById = (state: RootState, id?: string): EventDto | undefined => {
    return id ? state.planner.events.slice().flatMap((groupedEvent: GroupedEventDto) => groupedEvent.events.find((event) => event.id === id)).filter(x => !!x)[0] : undefined;
}

export const selectNameByEmail = (state: RootState, email: string): string => {
    const participant = state.planner.participants.find((p) => p.id === email);
    return participant ? participant.name : '';
}

export const selectBusyByEmail = (state: RootState, email: string): boolean => {
    const participant = state.planner.busyDatesOtherUsers.find((p) => p.userId === email);
    return !!participant;
}