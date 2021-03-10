import {search} from "../search";
import {mockBusyDates, mockBusyDatesResult, MockedEvents, mockEvents, mockEventsResult,} from "./utils";
import './customMatchers';
import {DateTime} from "luxon";
import {DATE_TIME_FORMAT} from "../app/eventCreator/slice";
import {EventDto} from "../services/eventService";

const abraham = 'abraham.rodriguez@ulpgc.es';
const alexis = 'alexis.quesada@ulpgc.es';
const idFn = () => '';
const from = "2021 05 03 08 00 00";
const to = "2021 05 31 19 00 00";
const events: Array<MockedEvents> = [
    {
        participants: [abraham, alexis],
        duration: 60
    }
];

const mockedGroupedEvent = mockEvents(events, from, to);

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

        mockedGroupedEvent.events.forEach((ev) => eventsResult.set(ev.id, {status: 'pending', date: '03-05-2021', time: '08:30'}));
        mockedEventsResult = mockEventsResult(mockedGroupedEvent.events, eventsResult);
        mockedGroupedEvent.events.forEach(ev => {
            const dateTime = ev.date + ' ' + ev.time;
            const start = DateTime.fromFormat(dateTime, 'dd-LL-yyyy HH:mm');
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
        expect(result).toHaveNBusyDates(abraham, 1)
        expect(result).not.toHaveBusyDates(abraham, '2021 05 05 08 30 00', '2021 05 03 09 30 00', '11')
    });

    it('1 indisponibilidad en el límite del día', () => {

        busyDatesMap.set(alexis, [{start: '2021 05 03 08 30 00', end:'2021 05 03 17 30 00'}]);
        const busyDates = mockBusyDates(busyDatesMap);
        const result = search(mockedGroupedEvent, busyDates, idFn);
        const mockedBusyDatesResult = mockBusyDatesResult(busyDates, busyDatesResult);

        expect(result).toHaveBusyDates(alexis, '2021 05 03 08 30 00', '2021 05 03 17 30 00');
        expect(result).toHaveBusyDates(alexis, '2021 05 03 17 30 00', '2021 05 03 18 30 00');

    });

    it('1 indisponibilidad último slot del día no posible', () => {

        busyDatesMap.set(alexis, [{start: '2021 05 03 08 30 00', end:'2021 05 03 18 00 00'}]);
        const busyDates = mockBusyDates(busyDatesMap);
        const result = search(mockedGroupedEvent, busyDates, idFn);

        expect(result).toHaveBusyDates(alexis, '2021 05 03 08 30 00', '2021 05 03 18 00 00');
        expect(result).toHaveBusyDates(abraham, '2021 05 04 08 30 00', '2021 05 04 09 30 00', '0');
    });

});
