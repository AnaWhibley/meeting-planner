import {RootState} from '../store';
import {BusyState} from './slice';
import {DateTime} from 'luxon';
import {DATE_FORMAT, DATE_TIME_FORMAT} from '../eventCreator/slice';
import {Role} from '../../services/userService';
import {BusyDto, EventDto, GroupedEventDto} from '../../services/eventService';

export const selectBusyDatesCurrentUser = (state: RootState) => state.planner.busyDatesCurrentUser.map((date: BusyState) => {
    const event = findEventById(state, date.eventId);
    const currentUserId = state.login.loggedInUser.id;
    const groupedEvent = findGroupedEventByEventId(state, date.eventId);
    const isAlreadyConfirmed = groupedEvent?.events.find(event => date.eventId === event.id)?.participants.find(participant => participant.email === currentUserId)?.confirmed;
    let canConfirm = false;
    if(!isAlreadyConfirmed && groupedEvent) {
        const start = DateTime.fromFormat(groupedEvent?.from, DATE_FORMAT);
        const oneWeekEarly = start.minus({ week: 1 }); //Cambiar aquí para ampliar la confirmación de eventos (después del periodo de confirmación)
        const diffWithNow = oneWeekEarly.diffNow('days').days;
        if(diffWithNow < 7 && diffWithNow > 0) {
            canConfirm = true;
        }
    }

    return {
        ...date,
        start: getJSDateFromString(date.start),
        end: getJSDateFromString(date.end),
        title: date.eventId ? event?.name + ' está programado' : 'Estás ocupado/a',
        color: date.eventId ? '#8bc9ff' : '#2896FF',
        textColor: 'black',
        canDelete: !date.eventId,
        groupId: 'currentUser',
        status: event?.status,
        isAlreadyConfirmed,
        canConfirm
    }
});
export const selectBusyDatesOtherUsers = (state: RootState) => state.planner.busyDatesOtherUsers.filter((user) => state.planner.selectedParticipants.includes(user.userId)).flatMap((user) => {

    const u = state.planner.participants.find(participant => participant.id === user.userId);

    return user.busy.map((date: BusyState) => {
        const event = findEventById(state, date.eventId);

        const isEvent = date.eventId;
        const userName = u?.name;
        const eventName = event?.name;

        const currentUser = state.login.loggedInUser;

        const title =
            currentUser?.role === Role.ADMIN ? userName +
                (isEvent ? ' tiene programado el evento ' + event?.name : ' está ocupado')
                :
                userName + (
                    isEvent ?
                        (eventName ?
                            ' también participa en ' + eventName
                            : ' tiene programado un evento'
                        ) : ' está ocupado/a');

        return {
            ...date,
            start: getJSDateFromString(date.start),
            end: getJSDateFromString(date.end),
            textColor: 'black',
            color: u?.color,
            title,
            canDelete: false,
            status: event?.status
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
    const busyDates = state.login.loggedInUser.role === Role.ADMIN ?
        state.planner.busyDatesOtherUsers.flatMap(busyDate => busyDate.busy.filter(busy => busy.eventId)) :
        state.planner.busyDatesCurrentUser.filter(busy => busy.eventId);
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
    const selectedEvents = state.planner.selectedEvents.flatMap((event) => event);
    return Array.from(eventMap.values()).filter(event => selectedEvents.includes(event.eventId));
};

const getJSDateFromString = (date: string): Date => DateTime.fromFormat(date, DATE_TIME_FORMAT, {zone: 'UTC'}).toJSDate();

const findEventById = (state: RootState, id?: string): EventDto | undefined => {
    return id ? state.planner.events.flatMap((groupedEvent: GroupedEventDto) => groupedEvent.events.find((event) => event.id === id)).filter(x => !!x)[0] : undefined;
}

const findGroupedEventByEventId = (state: RootState, id?: string): GroupedEventDto | undefined => {
    return id ? state.planner.events.find((groupedEvent: GroupedEventDto) => groupedEvent.events.find((event) => event.id === id)) : undefined;
}

export const selectNameByEmail = (state: RootState, email: string): string => {
    const participant = state.planner.participants.find((p) => p.id === email);
    return participant ? participant.name : '';
}

export const selectBusyByEmail = (state: RootState, email: string): boolean => {
    if(state.login.loggedInUser.id !== email){
        const participantBusyDates = state.planner.busyDatesOtherUsers.find((p) => p.userId === email);
        if(participantBusyDates) {
            return participantBusyDates.busy.filter((busyDate: BusyDto) => busyDate.eventId === undefined).length > 0;
        }else{
            return false;
        }
    }else{
        return state.planner.busyDatesCurrentUser.filter((busyDate: BusyDto) => busyDate.eventId === undefined).length > 0;
    }
}