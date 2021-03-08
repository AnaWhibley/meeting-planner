import {BusyDateDto, BusyDto, GroupedEventDto} from "../services/eventService";

export function mockEvent(from: string, to: string, participantsId: Array<string>, duration: number = 60): GroupedEventDto {
    const participants = participantsId.reduce((acc: Array<{email: string, tag: string}>, current) => {
            const participant = {
                email: current,
                tag: ''
            };
        return [...acc, participant];
        }, []);
    return {groupName: 'Test 20/21',
        from,
        to,
        events: [
            {
                id: '11',
                name: 'Defensa TFT Test',
                participants,
                duration,
                status: '',
                date: '',
                time: ''
            }
        ]
    }
}

export function mockEventsResult(event: GroupedEventDto, status: Array<string>, date: Array<string>, time: Array<string>) {

    event.events.forEach((e, i) => {
        e.status = status[i];
        e.date = date[i];
        e.time = time[i]
    });

    return event.events;
}

export function mockBusyDates(userIds: Array<string>, busyDates: Array<Array<{start: string, end: string, eventId?: string}>>) {

    return userIds.reduce((acc: Array<BusyDateDto>, current: string, index: number) => {

        const busy = busyDates[index].map((busy) => {
            const b: BusyDto = {start: busy.start, end: busy.end, allDay: false, id: ''};
            if(busy.eventId) b.eventId = busy.eventId;
            return b;
        });

        const busyDate = {
            userId: current,
            busy
        };

        return [...acc, busyDate];

    }, []);

}

/*export function mockBusyDatesResult(busyDates: Array<BusyDateDto>, start: string, end: string, eventId: string) {

    const newBusy: BusyDto = {
        allDay: false,
        id: '',
        start,
        end,
        eventId
    }

    if(busyDates.length > 0) {
        busyDates.forEach((busyDate) => {
            busyDate.busy.push(newBusy);
        });
    }else{

    }


}*/
