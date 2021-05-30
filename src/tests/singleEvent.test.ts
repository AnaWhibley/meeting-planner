import {search} from "../search";
import {
    abraham, alexis, domingo, generateBusyDatesResultMap, idFn, josedaniel, juancarlos,
    mockBusyDates,
    mockBusyDatesResult,
    MockedEvents,
    mockEventsResult,
    mockGroupedEvent, octavio, paqui,
} from "./utils";
import './customMatchers';
import {BusyDateDto, EventDto} from "../services/eventService";

const from = '03/05/2021';
const to = '31/05/2021';


describe('Basic case (1 event) (2 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis],
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

    it('should fit in first day at 08:30 - 09:30 (0 unavailabilities)', () => {

        groupedEvent.events.forEach((ev) => eventsMap.set(ev.id, {status: 'pending', date: '03/05/2021', time: '08:30'}));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult([], generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, [], idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 1);
        expect(result).not.toHaveBusyDates(abraham, '05/05/2021 08:30', '05/05/2021 09:30');
    });

    it('should fit in last slot of the day 17:30 - 18:30 (1 unavailability)', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 17:30'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 17:30');
        expect(result).toHaveBusyDates(alexis, '03/05/2021 17:30', '03/05/2021 18:30');
        expect(result).toHaveBusyDates(abraham, '03/05/2021 17:30', '03/05/2021 18:30');
    });

    it('should fit in first slot of the next day 08:30 - 09:30 (1 unavailability)', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 18:00'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 18:00');
        expect(result).toHaveBusyDates(abraham, '04/05/2021 08:30', '04/05/2021 09:30', '0');
    });

    it('should fit in second slot of the next day 10:00 - 11:00 (2 unavailabilities)', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 18:00'}]);
        busyDatesMap.set(abraham, [{start: '04/05/2021 08:30', end:'04/05/2021 10:00'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result).toHaveBusyDates(alexis, '04/05/2021 10:00', '04/05/2021 11:00', '0');
        expect(result).toHaveBusyDates(abraham, '04/05/2021 10:00', '04/05/2021 11:00', '0');
    });

    it('should fit in third day 10:30 - 11:30 (5 unavailabilities)', () => {

        busyDatesMap.set(alexis, [
            {start: '03/05/2021 08:30', end:'03/05/2021 18:00'},
            {start: '04/05/2021 08:30', end:'04/05/2021 18:00'}]
        );
        busyDatesMap.set(abraham, [
            {start: '03/05/2021 08:30', end:'03/05/2021 18:00'},
            {start: '04/05/2021 08:30', end:'04/05/2021 18:00'},
            {start: '04/05/2021 08:30', end:'05/05/2021 10:30'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result).toHaveBusyDates(alexis, '05/05/2021 10:30', '05/05/2021 11:30', '0');
        expect(result).toHaveBusyDates(abraham, '05/05/2021 10:30', '05/05/2021 11:30', '0');
    });
});

describe('Basic case (1 event) (7 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis, octavio, domingo, paqui, juancarlos, josedaniel],
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

    it('should fit in first day at 08:30 - 09:30 (0 unavailabilities)', () => {

        groupedEvent.events.forEach((ev) => eventsMap.set(ev.id, {status: 'pending', date: '03/05/2021', time: '08:30'}));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult([], generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, [], idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 1);
        expect(result).not.toHaveBusyDates(abraham, '05/05/2021 08:30', '05/05/2021 09:30');
    });

    it('should fit in last slot of the day 17:30 - 18:30 (1 unavailability)', () => {

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 17:30'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 17:30');
        expect(result).toHaveBusyDates(alexis, '03/05/2021 17:30', '03/05/2021 18:30', '0');
        expect(result).toHaveBusyDates(abraham, '03/05/2021 17:30', '03/05/2021 18:30', '0');
    });

    it('should fit in first slot of the first day 08:30 - 09:30 because the unavailability does not affect (1 unavailability)', () => {

        busyDatesMap.set(alexis, [{start: '04/05/2021 08:30', end:'04/05/2021 18:00'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result).toHaveBusyDates(abraham, '03/05/2021 08:30', '03/05/2021 09:30', '0');
        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 09:30', '0');
    });

    it('should fit in last slot of the day 17:30 - 18:30 (5 unavailabilities)', () => {

        groupedEvent.events.forEach((ev) => eventsMap.set(ev.id, {status: 'pending', date: '03/05/2021', time: '17:30'}));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult([], generateBusyDatesResultMap(eventsResult));

        busyDatesMap.set(alexis, [{start: '06/05/2021 08:30', end:'06/05/2021 14:30'}, {start: '04/05/2021 08:30', end:'04/05/2021 14:30'}, {start: '03/05/2021 08:30', end:'03/05/2021 17:30'}]);
        busyDatesMap.set(octavio, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(abraham, [{start: '03/05/2021 08:30', end:'03/05/2021 10:30'}]);
        busyDatesMap.set(domingo, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);

        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveNBusyDates(abraham, 2);
        expect(result).toHaveNBusyDates(alexis, 4);
        expect(result).toHaveNBusyDates(paqui, 1);
        expect(result).toHaveBusyDates(alexis, '03/05/2021 08:30', '03/05/2021 17:30');
        expect(result).toHaveBusyDates(alexis, '03/05/2021 17:30', '03/05/2021 18:30', '0');
        expect(result).toHaveBusyDates(abraham, '03/05/2021 17:30', '03/05/2021 18:30', '0');
    });
});
