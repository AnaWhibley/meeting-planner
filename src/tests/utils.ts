import {BusyDateDto, BusyDto, EventDto, GroupedEventDto} from "../services/eventService";

export interface MockedEvents {
    participants: Array<string>;
    duration: number;
}

export function mockEvents(events: Array<MockedEvents>, from: string, to: string): GroupedEventDto {

    const mockedEvents: Array<EventDto> = events.map((ev, i) => ({
            id: i.toString(),
            name: 'Defensa TFT Test',
            status: '',
            date: '',
            time: '',
            duration: ev.duration,
            participants: ev.participants.map(p => ({email: p, tag: '', confirmed: false}))
        }));
        return {
            groupName: 'Test 20/21',
            from,
            to,
            events: mockedEvents
        }
}

export function mockEventsResult(events: Array<EventDto>, data: Map<string, {status: string; date?: string; time?: string}>): Array<EventDto> {
    return events.map(ev => {
        const info = data.get(ev.id);
        if(info) {
            ev.status = info.status;
            ev.date = info.date || '';
            ev.time = info.time || '';
        }
        return ev;
    })
}

export function mockBusyDates(data: Map<string, Array<{start: string; end: string;}>>): Array<BusyDateDto> {
    const busyDates: Array<BusyDateDto> = [];
    for(let entry of data) {
        const userId: string = entry[0];
        const busy = entry[1].map((bd) => {
            return {
                allDay: false,
                start: bd.start,
                end: bd.end,
                id: ''
            }
        });
        busyDates.push({userId, busy});
    }
    return busyDates;
}

export function mockBusyDatesResult(busyDates: Array<BusyDateDto>, data: Map<string, Array<{start: string; end: string; eventId: string}>>): Array<BusyDateDto> {
    const busyDatesCopy = busyDates.slice();
    for(let entry of data) {
        const userId: string = entry[0];
        const busyDatesUserIndex = busyDatesCopy.findIndex((bd) => bd.userId === userId);
        const busy: Array<BusyDto> = entry[1].map((bd) => {
            return {
                allDay: false,
                start: bd.start,
                end: bd.end,
                id: '',
                eventId: bd.eventId
            }
        });
       if(busyDatesUserIndex !== -1) {
           busyDatesCopy[busyDatesUserIndex].busy.concat(busy);
       }else{
           const newBusy: BusyDateDto = {
               userId,
               busy
           }
           busyDatesCopy.push(newBusy);
       }
    }

    return busyDatesCopy;
}
