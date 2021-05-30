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
    julio,
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

        const data = [{status: 'pending', date: '03/05/2021', time: '10:30'},{status: 'pending', date: '03/05/2021', time: '11:30'}];
        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 10:30'}]);
        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
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

describe('Basic case (4 events) (2 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis],
            duration: 60
        },
        {
            participants: [domingo, octavio],
            duration: 60
        },
        {
            participants: [juanca, paqui],
            duration: 60
        },
        {
            participants: [julio, josemi],
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

        const data = [
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'}
            ];
        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult(mockBusyDates(busyDatesMap), generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, [], idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveBusyDates(abraham, '03/05/2021 08:30', '03/05/2021 09:30', '0');
        expect(result).toHaveBusyDates(domingo, '03/05/2021 08:30', '03/05/2021 09:30', '1');
        expect(result).toHaveBusyDates(paqui, '03/05/2021 08:30', '03/05/2021 09:30', '2');
        expect(result).toHaveBusyDates(julio, '03/05/2021 08:30', '03/05/2021 09:30', '3');
    });

    it('should consider busy dates (6 unavailabilities)', () => {

        const data = [
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '05/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '14:30'}
            ];

        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(juanca, [{start: '03/05/2021 08:30', end:'03/05/2021 09:30'}]);
        busyDatesMap.set(josemi, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(octavio, [
            {start: '03/05/2021 08:30', end:'03/05/2021 18:30'},
            {start: '04/05/2021 08:30', end:'04/05/2021 18:30'},
            {start: '06/05/2021 08:30', end:'06/05/2021 14:30'}
            ]
        );

        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
        expect(result).toHaveBusyDates(abraham, '03/05/2021 14:30', '03/05/2021 15:30', '0');
        expect(result).toHaveBusyDates(octavio, '05/05/2021 08:30', '05/05/2021 09:30', '1');
        expect(result).toHaveBusyDates(paqui, '03/05/2021 09:30', '03/05/2021 10:30', '2');
        expect(result).toHaveBusyDates(julio, '03/05/2021 14:30', '03/05/2021 15:30', '3');
    });
});

describe('Basic case (4 events) (7 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis, octavio, josedaniel, josemi, paqui, juancarlos],
            duration: 60
        },
        {
            participants: [abraham, octavio, domingo, josejuan, juanca, paqui, alexis],
            duration: 60
        },
        {
            participants: [josemi, domingo, juancarlos, julio, josedaniel, octavio, alexis],
            duration: 60
        },
        {
            participants: [abraham, octavio, josemi, josejuan, juanca, paqui, alexis],
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

        const data = [
            {status: 'pending', date: '04/05/2021', time: '17:30'},
            {status: 'pending', date: '05/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '05/05/2021', time: '09:30'}
            ];
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
        expect(result).toHaveNBusyDates(abraham, 5);
        expect(result).toHaveNBusyDates(julio, 1);
        expect(result).toHaveBusyDates(alexis, '04/05/2021 17:30', '04/05/2021 18:30', '0');
        expect(result).toHaveBusyDates(juanca, '05/05/2021 08:30', '05/05/2021 09:30', '1');
        expect(result).toHaveBusyDates(julio, '03/05/2021 14:30', '03/05/2021 15:30', '2');
        expect(result).toHaveBusyDates(octavio, '05/05/2021 09:30', '05/05/2021 10:30', '3');
    });
});

describe('Basic case (10 events) (2 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis],
            duration: 60
        },
        {
            participants: [domingo, octavio],
            duration: 60
        },
        {
            participants: [juanca, paqui],
            duration: 60
        },
        {
            participants: [julio, josemi],
            duration: 60
        },
        {
            participants: [josedaniel, paqui],
            duration: 60
        },
        {
            participants: [juancarlos, josemi],
            duration: 60
        },
        {
            participants: [julio, josejuan],
            duration: 60
        },
        {
            participants: [alexis, josedaniel],
            duration: 60
        },
        {
            participants: [paqui, octavio],
            duration: 60
        },
        {
            participants: [domingo, juanca],
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

        const data = [
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '10:30'},
            {status: 'pending', date: '03/05/2021', time: '10:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'}
        ];
        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult(mockBusyDates(busyDatesMap), generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, [], idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
    });

    it('should consider busy dates (3 unavailabilities)', () => {

        const data = [
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '11:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '12:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '15:30'},
            {status: 'pending', date: '03/05/2021', time: '13:30'},
            {status: 'pending', date: '03/05/2021', time: '10:30'}
        ];

        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(juanca, [{start: '03/05/2021 08:30', end:'03/05/2021 10:30'}]);
        busyDatesMap.set(paqui, [{start: '03/05/2021 08:30', end:'03/05/2021 11:30'}]);

        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
    });

    it('should consider busy dates (6 unavailabilities)', () => {

        const data = [
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '05/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '11:30'},
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '03/05/2021', time: '12:30'},
            {status: 'pending', date: '03/05/2021', time: '15:30'},
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '15:30'},
            {status: 'pending', date: '05/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '10:30'}
        ];

        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(alexis, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(juanca, [{start: '03/05/2021 08:30', end:'03/05/2021 10:30'}]);
        busyDatesMap.set(paqui, [{start: '03/05/2021 08:30', end:'03/05/2021 11:30'}]);
        busyDatesMap.set(josemi, [{start: '03/05/2021 08:30', end:'03/05/2021 14:30'}]);
        busyDatesMap.set(octavio, [
                {start: '03/05/2021 08:30', end:'03/05/2021 18:30'},
                {start: '04/05/2021 08:30', end:'04/05/2021 18:30'},
                {start: '06/05/2021 08:30', end:'06/05/2021 14:30'}
            ]
        );

        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
    });
});

describe('Basic case (10 events) (7 participants)', () => {

    const events: Array<MockedEvents> = [
        {
            participants: [abraham, alexis, octavio, josedaniel, josemi, paqui, juancarlos],
            duration: 60
        },
        {
            participants: [abraham, octavio, domingo, josejuan, juanca, paqui, julio],
            duration: 60
        },
        {
            participants: [josemi, domingo, juancarlos, julio, josedaniel, octavio, alexis],
            duration: 60
        },
        {
            participants: [juanca, alexis, josemi, josejuan, josedaniel, paqui, julio],
            duration: 60
        },
        {
            participants: [abraham, alexis, octavio, domingo, josemi, paqui, juancarlos],
            duration: 60
        },
        {
            participants: [abraham, octavio, domingo, josemi, juanca, paqui, alexis],
            duration: 60
        },
        {
            participants: [josemi, domingo, juancarlos, julio, josedaniel, octavio, alexis],
            duration: 60
        },
        {
            participants: [abraham, octavio, juancarlos, josejuan, juanca, paqui, alexis],
            duration: 60
        },
        {
            participants: [abraham, alexis, octavio, josedaniel, josemi, paqui, juancarlos],
            duration: 60
        },
        {
            participants: [abraham, octavio, domingo, josedaniel, juanca, paqui, alexis],
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

    it('should not overlap', () => {

        const data = [
            {status: 'pending', date: '03/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '09:30'},
            {status: 'pending', date: '03/05/2021', time: '10:30'},
            {status: 'pending', date: '03/05/2021', time: '11:30'},
            {status: 'pending', date: '03/05/2021', time: '12:30'},
            {status: 'pending', date: '03/05/2021', time: '13:30'},
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '03/05/2021', time: '15:30'},
            {status: 'pending', date: '03/05/2021', time: '16:30'},
            {status: 'pending', date: '03/05/2021', time: '17:30'}
        ];

        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);
        busyDatesResult = mockBusyDatesResult(mockBusyDates(busyDatesMap), generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, [], idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
    });

    it('should consider all busy dates (5 unavailabilities)', () => {

        const data = [
            {status: 'pending', date: '05/05/2021', time: '14:30'},
            {status: 'pending', date: '05/05/2021', time: '08:30'},
            {status: 'pending', date: '03/05/2021', time: '14:30'},
            {status: 'pending', date: '05/05/2021', time: '15:30'},
            {status: 'pending', date: '05/05/2021', time: '16:30'},
            {status: 'pending', date: '05/05/2021', time: '17:30'},
            {status: 'pending', date: '03/05/2021', time: '15:30'},
            {status: 'pending', date: '06/05/2021', time: '08:30'},
            {status: 'pending', date: '06/05/2021', time: '09:30'},
            {status: 'pending', date: '06/05/2021', time: '10:30'}
        ];

        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(paqui, [
            {start: '03/05/2021 08:30', end:'03/05/2021 18:30'},
            {start: '04/05/2021 08:30', end:'04/05/2021 18:30'}]
        );
        busyDatesMap.set(alexis, [
                {start: '03/05/2021 08:30', end:'03/05/2021 14:30'},
                {start: '04/05/2021 08:30', end:'04/05/2021 14:30'},
                {start: '05/05/2021 08:30', end:'05/05/2021 14:30'}
            ]
        );

        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
    });

    it('should consider all busy dates (10 unavailabilities)', () => {

        const data = [
            {status: 'pending', date: '07/05/2021', time: '08:30'},
            {status: 'pending', date: '05/05/2021', time: '08:30'},
            {status: 'pending', date: '07/05/2021', time: '09:30'},
            {status: 'pending', date: '07/05/2021', time: '10:30'},
            {status: 'pending', date: '05/05/2021', time: '14:30'},
            {status: 'pending', date: '05/05/2021', time: '15:30'},
            {status: 'pending', date: '07/05/2021', time: '11:30'},
            {status: 'pending', date: '05/05/2021', time: '16:30'},
            {status: 'pending', date: '07/05/2021', time: '12:30'},
            {status: 'pending', date: '07/05/2021', time: '13:30'}
        ];

        groupedEvent.events.forEach((ev, index) => eventsMap.set(ev.id, data[index]));
        eventsResult = mockEventsResult(groupedEvent.events, eventsMap);

        busyDatesMap.set(paqui, [
            {start: '03/05/2021 08:30', end:'03/05/2021 18:30'},
            {start: '04/05/2021 08:30', end:'04/05/2021 18:30'}]
        );
        busyDatesMap.set(alexis, [
                {start: '03/05/2021 08:30', end:'03/05/2021 14:30'},
                {start: '04/05/2021 08:30', end:'04/05/2021 14:30'},
                {start: '05/05/2021 08:30', end:'05/05/2021 14:30'}
            ]
        );
        busyDatesMap.set(josedaniel, [
            {start: '03/05/2021 07:30', end:'03/05/2021 19:30'},
            {start: '04/05/2021 07:30', end:'04/05/2021 19:30'},
            {start: '05/05/2021 07:30', end:'05/05/2021 19:30'},
            {start: '06/05/2021 07:30', end:'06/05/2021 19:30'},
            ]
        );
        busyDatesMap.set(octavio, [{start: '03/05/2021 10:30', end:'03/05/2021 18:30'}]);


        const mockedBusyDates = mockBusyDates(busyDatesMap);
        busyDatesResult = mockBusyDatesResult(mockedBusyDates, generateBusyDatesResultMap(eventsResult));

        const result = search(groupedEvent, mockedBusyDates, idFn);

        expect(result.events).toEqual(eventsResult);
        expect(result.busyDates).toBusyDatesBeEqual(busyDatesResult);
    });
});
