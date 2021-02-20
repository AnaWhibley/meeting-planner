import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {BusyState} from '../app/planner/slice';
import {Role, User} from './userService';

export interface CreateResponse {
    success: boolean;
}

export interface BusyStateDto {
    id: string;
    start: string;
    end: string;
    allDay: boolean;
}

const busyDates = [
    {
        userId: '1',
        busyDates: [{
            start: "2021 2 17 00 00 00",
            end: "2021 2 18 00 00 00",
            id: '111',
            allDay: true,
        }, {
            start: "2021 2 18 16 00 00",
            end: "2021 2 18 18 30 00",
            id: '222',
            allDay: false
        }]
    }, {
        userId: '2',
        busyDates: [{
            start: "2021 2 16 08 00 00",
            end: "2021 2 16 20 00 00",
            id: '333',
            allDay: false
        }, {
            start: "2021 2 19 08 00 00",
            end: "2021 2 19 19 30 00",
            id: '444',
            allDay: false
        },{
            start: "2021 2 15 08 00 00",
            end: "2021 2 15 19 30 00",
            id: '444',
            allDay: false
        }]
    },
    {
        userId: '3',
        busyDates: [{
            start: "2021 2 15 08 00 00",
            end: "2021 2 15 15 30 00",
            id: '555',
            allDay: false
        },{
            start: "2021 2 15 16 00 00",
            end: "2021 2 15 18 30 00",
            id: '555',
            allDay: false
        }]
    }, {
        userId: '5',
        busyDates: [{
            start: "2021 2 18 08 00 00",
            end: "2021 2 18 15 30 00",
            id: '666',
            allDay: false
        }, {
            start: "2021 2 15 08 00 00",
            end: "2021 2 15 15 30 00",
            id: '777',
            allDay: false
        }, {
            start: "2021 2 17 08 00 00",
            end: "2021 2 17 10 30 00",
            id: '888',
            allDay: false
        }, {
            start: "2021 2 17 12 00 00",
            end: "2021 2 17 14 30 00",
            id: '999',
            allDay: false
        }]
    }, {
        userId: '9',
        busyDates: [{
            start: "2021 2 18 08 00 00",
            end: "2021 2 18 14 30 00",
            id: '100',
            allDay: false
        }, {
            start: "2021 2 16 08 00 00",
            end: "2021 2 16 16 00 00",
            id: '101',
            allDay: false
        }, {
            start: "2021 2 17 10 00 00",
            end: "2021 2 17 12 30 00",
            id: '102',
            allDay: false
        }]
    },
];

const events = [
    {
        groupName: 'Ordinaria 20/21',
        from: "2021 2 10 08 00 00",
        to: "2021 3 15 08 00 00",
        events: [
            {
                id: '11',
                name: 'Defensa TFT Ana Santana',
                participants: ['1', '2', '3', '4', '5', '6']
            },
            {
                id: '22',
                name: 'Defensa TFT Lara Viera',
                participants: ['6', '7', '8', '10', '11', '12']
            },
            {
                id: '33',
                name: 'Defensa TFT Juan Sánchez',
                participants: ['5', '7', '8', '1', '10', '12']
            },
            {
                id: '44',
                name: 'Defensa TFT Juan Pérez',
                participants: ['5', '7', '8', '6', '12', '11']
            },
        ]
    },
]

class EventService {
    private static events: any = [];
    public static create(events: Array<any>): Observable<CreateResponse> {
        this.events = events;
        return of({success: true}).pipe(delay(1000))
    }

    public static addBusyDate(busyDate: BusyState): Observable<any> {
        return of({success: true}).pipe(delay(1000))
    }

    public static getBusyDates(userIds: Array<string>, currentUser: User): Observable<Array<{ userId: string, busyDates: Array<BusyState> }>> {
        if(currentUser.role === Role.ADMIN) {
            return of(busyDates.slice()).pipe(delay(1000));
        }

        const filteredBusyDates = busyDates.filter((busyDate) => userIds.includes((busyDate.userId)));
        return of(filteredBusyDates.slice()).pipe(delay(1000));
    }

    public static getEvents(user: User): Observable<any> {
        if(user.role === Role.ADMIN) {
            return of(events.slice()).pipe(delay(1000));
        }

        const filteredEvents = events.map((ev) => {
            return { ...ev,
                    events: ev.events.reduce((acc: any, current: any) => {
                        return current.participants.includes(user.id) ? [...acc, current] : acc;
                    }, [])
                }
        });

        return of(filteredEvents.slice()).pipe(delay(1000));
    }
}

export default EventService;