import {search} from "../search";
import {mockBusyDatesResult, MockedEvents, mockEvents, mockEventsResult} from "./utils";
import {EventDto} from "../services/eventService";
import {DateTime} from "luxon";
import {DATE_TIME_FORMAT} from "../app/eventCreator/slice";

const abraham = 'abraham.rodriguez@ulpgc.es';
const alexis = 'alexis.quesada@ulpgc.es';
const idFn = () => '';
const from = "2021 05 03 08 00 00";
const to = "2021 05 31 19 00 00";
const events: Array<MockedEvents> = [
    {
        participants: [abraham, alexis],
        duration: 60
    },
    {
        participants: [abraham, alexis],
        duration: 60
    }
];

const mockedGroupedEvent = mockEvents(events, from, to);

describe('Basic 2 events', () => {

    let eventsResult: Map<string, {status: string; date?: string; time?: string}>;
    let busyDatesResult: Map<string, Array<{start: string; end: string; eventId: string}>>;
    let busyDatesMap: Map<string, Array<{start: string; end: string;}>>;
    let mockedEventsResult: Array<EventDto>;

    beforeEach(() => {
        eventsResult = new Map();
        busyDatesResult = new Map();
        busyDatesMap = new Map();
    });

    it('should not overlap with 0 indisponibilidades', () => {
        const data = [{status: 'pending', date: '03-05-2021', time: '08:30'}, {status: 'pending', date: '03-05-2021', time: '09:30'}];
        mockedGroupedEvent.events.forEach((ev, i) => eventsResult.set(ev.id, data[i]));
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
    });

});
