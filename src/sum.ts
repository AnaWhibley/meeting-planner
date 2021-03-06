import {BusyDateDto, BusyDto, EventDto, GroupedEventDto} from './services/eventService';
import {DateTime, Interval} from 'luxon';
import {DATE_FORMAT, DATE_TIME_FORMAT} from './app/eventCreator/slice';
import {v4 as uuidv4} from 'uuid';

export function sum(a: number, b: number) {
    return a + b;
}

export function search(groupedEvent: GroupedEventDto, busyDates: Array<BusyDateDto>, idFn: () => string = uuidv4): { events: Array<EventDto>, busyDates: Array<BusyDateDto>} {
    const events: Array<EventDto> = groupedEvent.events.slice();
    const newBusyDates = busyDates.slice();
    const from: DateTime = DateTime.fromFormat(groupedEvent.from, DATE_TIME_FORMAT);
    const to: DateTime = DateTime.fromFormat(groupedEvent.to, DATE_TIME_FORMAT);
    const endWorkingHour: number = 18;
    const startWorkingHour: number = 8;
    const workingMinutes: number = 30;

    const busyIntervals: Map<string, Array<Interval>> = mapBusyDatesToIntervals(busyDates);

    for(let i = 0; i < events.length; i++){
        const duration: number = events[i].duration;
        let found = false;

        for(let j = from; j < to; j = j.plus({minutes: 15})){

            // Last possible slot
            const end: DateTime = j.plus({minutes: duration});

            if(j.weekday === 6 || j.weekday === 7 || j.hour < startWorkingHour || (j.hour === startWorkingHour && j.minute < workingMinutes) || end.hour > endWorkingHour || (end.hour === endWorkingHour && end.minute > workingMinutes)){
                continue;
            }

            const userIds = events[i].participants.map(p => p.email);
            const event: Interval = Interval.after(j, {minutes: duration});
            const isValid = userIds.every((uid) => {
                const busyIntervalsUser = busyIntervals.get(uid) || [];
                return busyIntervalsUser.every(interval => !interval.overlaps(event))
            });

            if(isValid){
                console.log("Hemos encontrado un slot para el evento ", events[i].id, ' desde ', event.start.toFormat(DATE_TIME_FORMAT), ' hasta ', event.end.toFormat(DATE_TIME_FORMAT));

                found = true;

                userIds.forEach(id => {
                    const busy: Array<Interval> | undefined = busyIntervals.has(id) ? busyIntervals.get(id) : [];
                    if(busy) {
                        busy.push(event);
                        busyIntervals.set(id, busy);
                    }
                });

                events[i].date = event.start.toFormat(DATE_FORMAT);
                events[i].time = event.start.toFormat('HH:mm'); //Change this
                events[i].status = 'pending';

                userIds.forEach(id => {
                    const busyDateEvent: BusyDto = {start: event.start.toFormat(DATE_TIME_FORMAT), end: event.end.toFormat(DATE_TIME_FORMAT), allDay: false, eventId: events[i].id, id: idFn()}
                    const busyDatesIndex = newBusyDates.findIndex(b => b.userId === id);

                    if(busyDatesIndex !== -1) {
                        console.log("!!!!", busyDatesIndex)
                        newBusyDates[busyDatesIndex].busy.push(busyDateEvent);
                    }else{
                        const arrayBusyDates: Array<BusyDto> = [];
                        arrayBusyDates.push(busyDateEvent);
                        const newBusyUser: BusyDateDto = {userId: id, busy: arrayBusyDates}
                        newBusyDates.push(newBusyUser);
                    }
                });
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

function mapBusyDatesToIntervals(busyDates: Array<BusyDateDto>) {
    return busyDates.reduce(
        (acc, current) => {
            const intervals = current.busy.map(b => {
                const start = DateTime.fromFormat(b.start, DATE_TIME_FORMAT);
                const end = DateTime.fromFormat(b.end, DATE_TIME_FORMAT);
                return Interval.fromDateTimes(start, end);
            });
            return acc.set(current.userId, intervals);
        }, new Map<string, Array<Interval>>());
}