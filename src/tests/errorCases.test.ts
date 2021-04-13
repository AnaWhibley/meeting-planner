import {search} from "../search";
import {
    abraham, alexis, idFn,
    mockBusyDates,
    MockedEvents,
    mockGroupedEvent,
} from "./utils";
import './customMatchers';

describe('Error case (1 events) (2 participants)', () => {

    let eventsMap: Map<string, {status: string; date?: string; time?: string}>;
    let busyDatesMap: Map<string, Array<{start: string; end: string;}>>;

    beforeEach(() => {
        eventsMap = new Map();
        busyDatesMap = new Map();
    });

    it('should has status error', () => {

        const from = '03/05/2021';
        const to = '04/05/2021';
        const events: Array<MockedEvents> = [
            {
                participants: [abraham, alexis],
                duration: 60
            }
        ];

        const groupedEvent = mockGroupedEvent(events, from, to);
        busyDatesMap.set(abraham, [{start: '03/05/2021 08:30', end:'04/05/2021 19:00'}]);
        const result = search(groupedEvent, mockBusyDates(busyDatesMap), idFn);
        expect(result).toHaveStatus('error', '0');
    });
});

