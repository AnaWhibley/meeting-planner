import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {BusyState} from '../app/planner/slice';
import { v4 as uuidv4 } from 'uuid';
import {Role} from './userService';
import {User} from '../app/login/slice';

export interface CreateResponse {
    success: boolean;
}

export interface BusyDto {
    id: string;
    start: string;
    end: string;
    allDay: boolean;
    eventId?: string;
}

export interface BusyDateDto {
    userId: string;
    busy: Array<BusyDto>;
}

const busyDates: Array<BusyDateDto> = [
    {
        userId: 'abraham.rodriguez@ulpgc.es',
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
        userId: 'daniel.hernandez@ulpgc.es',
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
        userId: 'alexis.quesada@ulpgc.es',
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
        userId: 'antonio.ocon@ulpgc.es',
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
        userId: 'carmelo.cuenca@ulpgc.es',
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

export interface GroupedEventDto {
    groupName: string;
    from: string;
    to: string;
    events: Array<EventDto>;
}

export interface EventDto {
    id: string;
    name: string;
    participants: Array<ParticipantDto>;
    duration: number;
    status: string;
    date: string;
    time: string;
}

export interface ParticipantDto {
    email: string;
    tag: string;
}

const groupedEvents: Array<GroupedEventDto> = [
    {
        groupName: 'Ordinaria 20/21',
        from: "2021 2 10 08 00 00",
        to: "2021 3 15 19 00 00",
        events: [
            {
                id: '11',
                name: 'Defensa TFT Ana Santana',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'daniel.hernandez@ulpgc.es',    //3
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: '2021 2 26',
                time: '10:30'
            },
            {
                id: '22',
                name: 'Defensa TFT Lara Viera',
                participants: [
                    {
                        email: 'octavio.mayor@ulpgc.es',  //7
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'francisco.alayon@ulpgc.es', //2
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'francisca.quintana@ulpgc.es',    //9
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: '2021 2 28',
                time: '12:30'
            },
            {
                id: '33',
                name: 'Defensa TFT Juan Sánchez',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'francisco.alayon@ulpgc.es', //2
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'daniel.hernandez@ulpgc.es',    //3
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'octavio.mayor@ulpgc.es',  //7
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'francisca.quintana@ulpgc.es',    //9
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: 'pending',
                time: 'pending'
            },
            {
                id: '55',
                name: 'Defensa TFT Pedro Sánchez',
                participants: [
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'error',
                date: '2021 2 28',
                time: '14:30'
            },
            {
                id: '66',
                name: 'Defensa TFT Francisco Santana',
                participants: [
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 90,
                status: 'confirmed',
                date: '2021 1 30',
                time: '15:30'
            },
        ]
    },{
        groupName: 'Extraordinaria 20/21',
        from: "2021 5 10 08 00 00",
        to: "2021 6 15 19 00 00",
        events: [
            {
                id: '11',
                name: 'Defensa TFT Juan Sánchez',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'daniel.hernandez@ulpgc.es',    //3
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: '2021 2 26',
                time: '10:30'
            },
            {
                id: '22',
                name: 'Defensa TFT Juan Ramirez',
                participants: [
                    {
                        email: 'octavio.mayor@ulpgc.es',  //7
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'francisco.alayon@ulpgc.es', //2
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'francisca.quintana@ulpgc.es',    //9
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: '2021 2 28',
                time: '12:30'
            },
            {
                id: '33',
                name: 'Defensa TFT Romeo Santos',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'francisco.alayon@ulpgc.es', //2
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'daniel.hernandez@ulpgc.es',    //3
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'octavio.mayor@ulpgc.es',  //7
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'francisca.quintana@ulpgc.es',    //9
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: 'pending',
                time: 'pending'
            },
            {
                id: '55',
                name: 'Defensa TFT Jiming Luan',
                participants: [
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'error',
                date: '2021 2 28',
                time: '14:30'
            },
            {
                id: '66',
                name: 'Defensa TFT Francisco Santana',
                participants: [
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 90,
                status: 'confirmed',
                date: '2021 1 30',
                time: '15:30'
            },
        ]
    },
]

class EventService {
    private static busyDatesSubject = new BehaviorSubject(busyDates.slice());

    public static create(event: GroupedEventDto): Observable<CreateResponse> {
        groupedEvents.push(event);
        return of({success: true}).pipe(delay(500))
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

    public static getBusyDates(userIds?: Array<string>): Observable<Array<BusyDateDto>> {

        if(!userIds) {
            return this.busyDatesSubject.pipe(delay(100));
        }

        return this.busyDatesSubject.pipe(
            delay(200),
            map((dto: Array<BusyDateDto>) => dto.filter(bd => userIds.includes(bd.userId))),
        );
    }

    public static getEvents(user: User): Observable<Array<GroupedEventDto>> {

        if(user.role === Role.ADMIN) {
            return of(groupedEvents.slice()).pipe(delay(500));
        }

        const filteredEvents = groupedEvents.map((ev) => {
            return { ...ev,
                    events: ev.events.reduce((acc: Array<EventDto>, current: EventDto ) => {
                        return current.participants.find((participant) => participant.email === user.id) ? [...acc, current] : acc;
                    }, [])
                }
        });

        return of(filteredEvents.slice()).pipe(delay(500));
    }
}

export default EventService;
