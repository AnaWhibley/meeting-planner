import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, filter, map, tap} from 'rxjs/operators';
import {BusyState} from '../app/planner/slice';
import {Role, User} from './userService';
import { v4 as uuidv4 } from 'uuid';

export interface CreateResponse {
    success: boolean;
}

export interface BusyDto {
    id: string;
    start: string;
    end: string;
    allDay: boolean;
}

interface BusyDateDto {
    userId: string;
    busy: Array<BusyDto>;
}

const busyDates: Array<BusyDateDto> = [
    {
        userId: '1',
        busy: [{
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
        busy: [{
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
        busy: [{
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
        busy: [{
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
        busy: [{
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
    private static busyDatesSubject = new BehaviorSubject(busyDates.slice());

    public static create(events: Array<any>): Observable<CreateResponse> {
        this.events = events;
        return of({success: true}).pipe(delay(1000))
    }

    public static addBusyDate(busyDate: BusyState, userId: string): Observable<boolean> {
        const index = busyDates.findIndex((bd) => bd.userId === userId);
        const newBusy = { ...busyDate, id: uuidv4()};
        if(index > -1){
            busyDates[index].busy = [ ...busyDates[index].busy, newBusy];
        }else{
            busyDates.push({userId, busy: [newBusy]})
        }

        this.busyDatesSubject.next(busyDates.slice());
        return of(true);
    }

    public static deleteBusyDate(busyDateId: string): Observable<boolean> {
        busyDates.forEach((busyDate) => {
            let index = busyDate.busy.findIndex((busy) => busy.id === busyDateId);
            if(index > -1) {
                const copy = busyDate.busy.slice();
                copy.splice(index, 1);
                busyDate.busy = copy;
            }
        });

        this.busyDatesSubject.next(busyDates.slice());
        return of(true);
    }

    public static getBusyDates(userIds: Array<string>, currentUser: User): Observable<Array<BusyDateDto>> {
        if(currentUser.role === Role.ADMIN) {
            return this.busyDatesSubject.pipe(delay(100));
        }

        return this.busyDatesSubject.pipe(
            delay(200),
            map((dto: Array<BusyDateDto>) => dto.filter(bd => userIds.includes(bd.userId))),
        );
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