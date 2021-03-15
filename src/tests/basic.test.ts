import {search} from "../search";
import {mockBusyDates, mockBusyDatesResult, MockedEvents, mockEvents, mockEventsResult,} from "./utils";
import './customMatchers';
import {DateTime} from "luxon";
import {DATE_TIME_FORMAT} from "../app/eventCreator/slice";
import {EventDto} from "../services/eventService";

const abraham = 'abraham.rodriguez@ulpgc.es';
const alexis = 'alexis.quesada@ulpgc.es';
const idFn = () => '';
const from = "03/05/2021";
const to = "31/05/2021";
const events: Array<MockedEvents> = [
    {
        participants: [abraham, alexis],
        duration: 60
    }
];

const mockedGroupedEvent = mockEvents(events, from, to);

// Caso básico que contiene un solo evento con dos participantes

describe('Caso básico un evento', () => {

    let eventsResult: Map<string, {status: string; date?: string; time?: string}>;
    let busyDatesResult: Map<string, Array<{start: string; end: string; eventId: string}>>;
    let busyDatesMap: Map<string, Array<{start: string; end: string;}>>;
    let mockedEventsResult: Array<EventDto>;

    beforeEach(() => {
        eventsResult = new Map();
        busyDatesResult = new Map();
        busyDatesMap = new Map();
    });

    it('0 indisponibilidades', () => {

        mockedGroupedEvent.events.forEach((ev) => eventsResult.set(ev.id, {status: 'pending', date: '03/05/2021', time: '08:30'}));
        mockedEventsResult = mockEventsResult(mockedGroupedEvent.events, eventsResult);
        mockedGroupedEvent.events.forEach(ev => {
            const dateTime = ev.date + ' ' + ev.time;
            const start = DateTime.fromFormat(dateTime, DATE_TIME_FORMAT);
            const end = start.plus({minutes: ev.duration});
            const busyDate = {eventId: ev.id, start: start.toFormat(DATE_TIME_FORMAT), end: end.toFormat(DATE_TIME_FORMAT)};
            ev.participants.forEach(p => {
                const busyArray = busyDatesResult.has(p.email) ? busyDatesResult.get(p.email) : [];
                if(busyArray) {
                    busyArray.push(busyDate);
                    busyDatesResult.set(p.email, busyArray);
                }
            });
        });
        const mockedBusyDatesResult = mockBusyDatesResult([], busyDatesResult);

        const result = search(mockedGroupedEvent, [], idFn);

        expect(result.events).toEqual(mockedEventsResult);
        expect(result.busyDates).toEqual(mockedBusyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 1);
        expect(result).not.toHaveBusyDates(abraham, '05/05/2021 08:30', '05/05/2021 09:30');
    });

    it('1 indisponibilidad en el límite del día', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 17:30'}]);
        const busyDates = mockBusyDates(busyDatesMap);
        const mockedBusyDatesResult = mockBusyDatesResult(busyDates, busyDatesResult);

        const result = search(mockedGroupedEvent, busyDates, idFn);

        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 17:30');
        expect(result).toHaveBusyDates(alexis, '03/05/2021 17:30', '03/05/2021 18:30');

    });

    it('1 indisponibilidad último slot del día no posible', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 18:00'}]);
        const busyDates = mockBusyDates(busyDatesMap);
        const result = search(mockedGroupedEvent, busyDates, idFn);

        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 18:00');
        expect(result).toHaveBusyDates(abraham, '04/05/2021 08:30', '04/05/2021 09:30', '0');
    });

    it('2 indisponibilidades último slot del día no posible y primero del día siguiente tampoco', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 18:00'}]);
        busyDatesMap.set(abraham, [{start: '04/05/2021 08:30', end:'04/05/2021 10:00'}]);
        const busyDates = mockBusyDates(busyDatesMap);
        const result = search(mockedGroupedEvent, busyDates, idFn);

        expect(result).toHaveBusyDates(alexis, '04/05/2021 10:00', '04/05/2021 11:00', '0');
        expect(result).toHaveBusyDates(abraham, '04/05/2021 10:00', '04/05/2021 11:00', '0');
    });
});
