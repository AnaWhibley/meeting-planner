import {BusyDateDto, BusyDto, EventDto, GroupedEventDto} from './services/eventService';
import {DateTime, Interval} from 'luxon';
import {DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT} from './app/eventCreator/slice';
import {v4 as uuidv4} from 'uuid';
import {BusyDateState} from './app/planner/slice';

export interface SearchResult {
    events: Array<EventDto>;
    busyDates: Array<BusyDateState>;
}

export function search(groupedEvent: GroupedEventDto, busyDates: Array<BusyDateState>, idFn: () => string = uuidv4): SearchResult  {
    const events: Array<EventDto> = groupedEvent.events.slice();
    let newBusyDates = busyDates.slice();
    const from: DateTime = DateTime.fromFormat(groupedEvent.from, DATE_FORMAT);
    const to: DateTime = DateTime.fromFormat(groupedEvent.to, DATE_FORMAT);
    const endWorkingHour: number = 18;
    const startWorkingHour: number = 8;
    const workingMinutes: number = 30;

    const busyIntervals: Map<string, Array<BusyInterval>> = mapBusyDatesToIntervals(busyDates);

    for(let i = 0; i < events.length; i++){
        const duration: number = events[i].duration;
        let found = false;

        if(events[i].status === 'confirmed') continue;

        const userIds = events[i].participants.map(p => p.email);

        for(let j = from; j < to; j = j.plus({minutes: 15})){

            //Último slot posible
            const end: DateTime = j.plus({minutes: duration});

            const isWeekend = j.weekday === 6 || j.weekday === 7;
            const isBeforeWorkingHour = j.hour < startWorkingHour || (j.hour === startWorkingHour && j.minute < workingMinutes);
            const isAfterWorkingHour = end.hour === 0 || end.hour > endWorkingHour || (end.hour === endWorkingHour && end.minute > workingMinutes);

            if(isWeekend || isBeforeWorkingHour || isAfterWorkingHour){
                continue;
            }

            const event: Interval = Interval.after(j, {minutes: duration});

            const isValid = userIds.every((id) => {
                const busyIntervalsUser = busyIntervals.get(id) || [];
                return busyIntervalsUser.every(busyInterval => !busyInterval.interval.overlaps(event))
            });

            if(isValid){
                console.log("Hemos encontrado un slot para el evento ", events[i].id, ' desde ', event.start.toFormat(DATE_TIME_FORMAT), ' hasta ', event.end.toFormat(DATE_TIME_FORMAT));

                found = true;

                userIds.forEach(id => {
                    const arrayBusyDatesMap = busyIntervals.has(id) ? busyIntervals.get(id) as Array<BusyInterval>: [];
                    const temp = {interval: event, allDay: false, eventId: events[i].id, id: idFn()}
                    arrayBusyDatesMap.push(temp);
                    busyIntervals.set(id, arrayBusyDatesMap);
                });

                events[i] = {
                    ...events[i],
                    status: 'pending',
                    date: event.start.toFormat(DATE_FORMAT),
                    time: event.start.toFormat(TIME_FORMAT)
                };

                newBusyDates = mapBusyDatesFromIntervals(busyIntervals);

                break;
            }

        }

        if(!found) {
            console.log("No hemos encontrado espacio para el evento ", events[i].id);
            events[i].status = 'error';
        }

    }

    return {events, busyDates: newBusyDates}
}

interface BusyInterval {
    interval: Interval;
    allDay: boolean;
    eventId?: string;
    id: string;
}

function mapBusyDatesToIntervals(busyDates: Array<BusyDateState>) {
    return busyDates.reduce(
        (acc, current) => {
            const intervals = current.busy.map(b => {
                const start = DateTime.fromFormat(b.start, DATE_TIME_FORMAT);
                const end = DateTime.fromFormat(b.end, DATE_TIME_FORMAT);

                const interval: BusyInterval = {
                    interval: Interval.fromDateTimes(start, end),
                    allDay: b.allDay,
                    id: b.id
                }

                if(b.eventId) interval.eventId = b.eventId;

                return interval;
            });

            return acc.set(current.userId, intervals);

        }, new Map<string, Array<BusyInterval>>());
}

function mapBusyDatesFromIntervals(map: Map<string, Array<BusyInterval>>){
    const busyDates = [];
    for(let entry of map) {
        const userId: string = entry[0];
        const busy = entry[1].map(interval => {
            const busyDate: BusyDto = {
                start: interval.interval.start.toFormat(DATE_TIME_FORMAT),
                end: interval.interval.end.toFormat(DATE_TIME_FORMAT),
                allDay: interval.allDay,
                id: interval.id,
            };
            if(interval.eventId) busyDate.eventId = interval.eventId;
            return busyDate;
        });
        busyDates.push({userId, busy});
    }
    return busyDates;
}
