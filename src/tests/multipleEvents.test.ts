import {search} from "../search";
import {
    abraham,
    alexis,
    domingo,
    generateBusyDatesResultMap,
    idFn,
    josedaniel,
    josejuan,
    josemi,
    juanca,
    juancarlos,
    mockBusyDates,
    mockBusyDatesResult,
    MockedEvents,
    mockEventsResult,
    mockGroupedEvent,
    octavio,
    paqui,
} from "./utils";
import './customMatchers';
import {BusyDateDto, EventDto} from "../services/eventService";

const from = '03/05/2021';
const to = '31/05/2021';

describe('Basic case (2 events) (2 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis],
            duration: 60
        },
        {
            participants: [abraham, octavio],
            duration: 60
        }
    ];

    const groupedEvent = mockGroupedEvent(events, from, to);

    let eventsMap: Map<string, {status: string; date?: string; time?: string}>;
    let busyDatesMap: Map<string, Array<{start: string; end: string;}>>;
    let eventsResult: Array<EventDto>;
    let busyDatesResult: Array<BusyDateDto>;

    beforeEach(() => {
        eventsMap = new Map();
        busyDatesMap = new Map();
    });

    it('should not overlap (0 unavailabilities)', () => {

        const data = [{status: 'pending', date: '03/05/2021', time: '08:30'},{status: 'pending', date: '03/05/2021', time: '09:30'}];
        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult(mockBusyDates(busyDatesMap), generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, [], idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toEqual(busyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 2);
        expect(result).toHaveBusyDates(abraham, '03/05/2021 08:30', '03/05/2021 09:30', '0');
        expect(result).toHaveBusyDates(abraham, '03/05/2021 09:30', '03/05/2021 10:30', '1');
    });

    it('should consider busy dates (1 unavailability)', () => {

        const data = [{status: 'pending', date: '03/05/2021', time: '14:30'},{status: 'pending', date: '03/05/2021', time: '08:30'}];
        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 2);
        expect(result).toHaveBusyDates(abraham, '03/05/2021 14:30', '03/05/2021 15:30', '0');
        expect(result).toHaveBusyDates(alexis, '03/05/2021 14:30', '03/05/2021 15:30', '0');
        expect(result).toHaveBusyDates(abraham, '03/05/2021 08:30', '03/05/2021 09:30', '1');
        expect(result).toHaveBusyDates(octavio, '03/05/2021 08:30', '03/05/2021 09:30', '1');
    });
});

describe('Basic case (2 events) (7 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis, octavio, josedaniel, josemi, paqui, juancarlos],
            duration: 60
        },
        {
            participants: [abraham, octavio, domingo, josejuan, juanca, paqui, alexis],
            duration: 60
        }
    ];

    const groupedEvent = mockGroupedEvent(events, from, to);

    let eventsMap: Map<string, {status: string; date?: string; time?: string}>;
    let busyDatesMap: Map<string, Array<{start: string; end: string;}>>;
    let eventsResult: Array<EventDto>;
    let busyDatesResult: Array<BusyDateDto>;

    beforeEach(() => {
        eventsMap = new Map();
        busyDatesMap = new Map();
    });

    it('should consider all busy dates (9 unavailabilities)', () => {

        const data = [{status: 'pending', date: '04/05/2021', time: '17:30'},{status: 'pending', date: '05/05/2021', time: '08:30'}];
        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}, {start: '03/05/2021 17:30', end:'03/05/2021 19:00'}]);
        busyDatesMap.set(abraham, [{start: '03/05/2021 08:30', end:'03/05/2021 16:30'}, {start: '04/05/2021 08:30', end:'04/05/2021 17:30'}]);
        busyDatesMap.set(octavio, [{start: '03/05/2021 16:30', end:'03/05/2021 20:00'}]);
        busyDatesMap.set(paqui, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(josedaniel, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}, {start: '04/05/2021 08:30', end:'04/05/2021 14:30'}]);
        busyDatesMap.set(josejuan, [{start: '03/05/2021 08:30', end:'03/05/2021 19:30'}]);
        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 4);
        expect(result).toHaveBusyDates(abraham, '04/05/2021 17:30', '04/05/2021 18:30', '0');
        expect(result).toHaveBusyDates(alexis, '04/05/2021 17:30', '04/05/2021 18:30', '0');
        expect(result).toHaveBusyDates(josejuan, '05/05/2021 08:30', '05/05/2021 09:30', '1');
        expect(result).toHaveBusyDates(juanca, '05/05/2021 08:30', '05/05/2021 09:30', '1');
    });
});
