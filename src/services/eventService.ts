import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {BusyDateState, BusyState} from '../app/planner/slice';
import { v4 as uuidv4 } from 'uuid';
import {Role} from './userService';
import {User} from '../app/login/slice';
import {colors} from '../styles/theme';
import firebase from '../firebase-config';
import {ServiceResponse} from './utils';

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
            start: '01/03/2021 08:30',
            end: '01/03/2021 19:00',
            id: 'a',
            allDay: true,
        }, {
            start: '02/03/2021 08:30',
            end: '02/03/2021 19:00',
            id: 'b',
            allDay: false
        }, {
            start: '03/03/2021 08:30',
            end: '03/03/2021 09:30',
            id: 'c',
            eventId: '1',
            allDay: false,
        }, {
            start: '03/03/2021 09:30',
            end: '03/03/2021 10:30',
            id: 'r',
            eventId: '3',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'aa',
            eventId: '21',
            allDay: false,
        }, {
            start: '03/05/2021 09:30',
            end: '03/05/2021 10:30',
            id: 'mm',
            eventId: '23',
            allDay: false,
        }]
    },
    {
        userId: 'daniel.hernandez@ulpgc.es',
        busy: [{
            start: '09/03/2021 08:00',
            end: '09/03/2021 18:00',
            id: 'd',
            allDay: false
        }, {
            start: '19/02/2021 08:00',
            end: '19/02/2021 19:30',
            id: 'e',
            allDay: false
        }, {
            start: '03/03/2021 08:30',
            end: '03/03/2021 09:30',
            id: 'f',
            eventId: '1',
            allDay: false,
        }, {
            start: '03/03/2021 09:30',
            end: '03/03/2021 10:30',
            id: 't',
            eventId: '3',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'bb',
            eventId: '21',
            allDay: false,
        }, {
            start: '03/05/2021 09:30',
            end: '03/05/2021 10:30',
            id: 'nn',
            eventId: '23',
            allDay: false,
        }]
    },
    {userId: 'alexis.quesada@ulpgc.es',
        busy: [{
            start: '15/03/2021 08:00',
            end: '15/03/2021 15:30',
            id: 'g',
            allDay: false
        },{
            start: '15/03/2021 17:00',
            end: '15/03/2021 18:30',
            id: 'h',
            allDay: false
        }, {
            start: '03/03/2021 08:30',
            end: '03/03/2021 09:30',
            id: 'i',
            eventId: '1',
            allDay: false,
        }, {
            start: '03/03/2021 09:30',
            end: '03/03/2021 10:30',
            id: 'v',
            eventId: '3',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'cc',
            eventId: '21',
            allDay: false,
        }, {
            start: '03/05/2021 09:30',
            end: '03/05/2021 10:30',
            id: 'qq',
            eventId: '23',
            allDay: false,
        }]
    },
    {userId: 'antonio.ocon@ulpgc.es',
        busy: [ {
            start: '03/03/2021 08:30',
            end: '03/03/2021 09:30',
            id: 'j',
            eventId: '1',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'ee',
            eventId: '21',
            allDay: false,
        }]
    },
    {userId: 'carmelo.cuenca@ulpgc.es',
        busy: [ {
            start: '03/03/2021 08:30',
            end: '03/03/2021 09:30',
            id: 'k',
            eventId: '1',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'dd',
            eventId: '21',
            allDay: false,
        }]
    },
    {userId: 'octavio.mayor@ulpgc.es',
        busy: [ {
            start: '01/03/2021 08:30',
            end: '01/03/2021 09:30',
            id: 'l',
            eventId: '2',
            allDay: false,
        }, {
            start: '03/03/2021 09:30',
            end: '03/03/2021 10:30',
            id: 'u',
            eventId: '3',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'gg',
            eventId: '22',
            allDay: false,
        }, {
            start: '03/05/2021 09:30',
            end: '03/05/2021 10:30',
            id: 'pp',
            eventId: '23',
            allDay: false,
        }]
    },
    {userId: 'francisco.alayon@ulpgc.es',
        busy: [{
            start: '01/03/2021 08:30',
            end: '01/03/2021 09:30',
            id: 'm',
            eventId: '2',
            allDay: false,
        }, {
            start: '03/03/2021 09:30',
            end: '03/03/2021 10:30',
            id: 's',
            eventId: '3',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'hh',
            eventId: '22',
            allDay: false,
        }, {
            start: '03/05/2021 09:30',
            end: '03/05/2021 10:30',
            id: 'oo',
            eventId: '23',
            allDay: false,
        }]
    },
    {userId: 'francisca.quintana@ulpgc.es',
        busy: [ {
            start: '01/03/2021 08:30',
            end: '01/03/2021 09:30',
            id: 'n',
            eventId: '2',
            allDay: false,
        }, {
            start: '03/03/2021 09:30',
            end: '03/03/2021 10:30',
            id: 'w',
            eventId: '3',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'ii',
            eventId: '22',
            allDay: false,
        }, {
            start: '03/05/2021 09:30',
            end: '03/05/2021 10:30',
            id: 'rr',
            eventId: '23',
            allDay: false,
        }]
    },
    {userId: 'domingo.benitez@ulpgc.es',
        busy: [ {
            start: '01/03/2021 08:30',
            end: '01/03/2021 09:30',
            id: 'o',
            eventId: '2',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'jj',
            eventId: '22',
            allDay: false,
        }]
    },
    {userId: 'david.freire@ulpgc.es',
        busy: [ {
            start: '01/03/2021 08:30',
            end: '01/03/2021 09:30',
            id: 'p',
            eventId: '2',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'kk',
            eventId: '22',
            allDay: false,
        }]
    },
    {userId: 'jc.rodriguezdelpino@ulpgc.es',
        busy: [ {
            start: '01/03/2021 08:30',
            end: '01/03/2021 09:30',
            id: 'q',
            eventId: '2',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'll',
            eventId: '22',
            allDay: false,
        }]
    },
    {userId: 'eduardo.rodriguez@ulpgc.es',
        busy: [{
            start: '03/03/2021 08:30',
            end: '03/03/2021 09:30',
            id: 'x',
            eventId: '1',
            allDay: false,
        }, {
            start: '03/05/2021 08:30',
            end: '03/05/2021 09:30',
            id: 'ff',
            eventId: '21',
            allDay: false,
        }]
    }
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
    color?: string;
}

export interface ParticipantDto {
    email: string;
    tag: string;
}

const groupedEvents: Array<GroupedEventDto> = [
    {
        groupName: 'Ordinaria 20/21',
        from: '01/03/2021',
        to: '19/03/2021',
        events: [
            {
                id: '1',
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
                date: '03/03/2021',
                time: '08:30'
            },
            {
                id: '2',
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
                date: '01/03/2021',
                time: '08:30'
            },
            {
                id: '3',
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
                status: 'confirmed',
                date: '03/03/2021',
                time: '09:30'
            }
        ]
    },
    {
        groupName: 'Extraordinaria 20/21',
        from: '03/05/2021',
        to: '31/05/2021',
        events: [
            {
                id: '21',
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
                date: '03/05/2021',
                time: '08:30'
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
                date: '03/05/2021',
                time: '08:30'
            },
            {
                id: '23',
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
                date: '03/05/2021',
                time: '09:30'
            }
        ]
    }
];

function assignColor(groupedEvents: Array<GroupedEventDto>) {
    return groupedEvents.map((groupedEvent) => {
        let count = 0;
        const events = groupedEvent.events.map((e) => {
            return {...e, color: colors[count++ % colors.length]}
        });
        return {
            ...groupedEvent,
            events
        }
    })
}

function filterEventsByUser(groupedEvents: Array<GroupedEventDto>, user: User) {
    return groupedEvents.map((ev) =>{
        return {
            ...ev,
            events: ev.events.reduce((acc: Array<EventDto>, current: EventDto ) => {
                return current.participants.find((participant) => participant.email === user.id) ? [...acc, current] : acc;
            }, [])
        }
    }).filter((grouped) => grouped.events.length > 0);
}

export class EventService {
    private static busyDatesSubject = new BehaviorSubject(busyDates.slice());
    private static groupedEventsSubject = new BehaviorSubject(groupedEvents.slice());

    public static create(event: GroupedEventDto): Observable<CreateResponse> {
        groupedEvents.push(event);
        return of({success: true}).pipe(delay(500))
    }

    public static addBusyDate(busyDate: BusyState, userId: string): Observable<boolean> {
        return new Observable((subscriber) => {
            const docRef = firebase.firestore().collection('busyDates').doc(userId);
            firebase.firestore().runTransaction((transaction) => {
                return transaction.get(docRef).then((doc) => {
                    if (!doc.exists) {
                        subscriber.next(false);
                    }else{
                        const newBusy = {...busyDate, id: uuidv4()};
                        transaction.set(docRef, {busy: firebase.firestore.FieldValue.arrayUnion(newBusy)}, {merge: true});
                    }
                });
            }).then((response) => {
                subscriber.next(true);
            }).catch((err) => {
                subscriber.error(false);
            });
        });
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

    public static updateBusyDates(newBusyDates: Array<BusyDateState>): Observable<boolean> {

        return new Observable((subscriber) => {

            firebase.firestore().runTransaction((transaction) => {
                const results = newBusyDates.map(busyDate => {
                    const docRef = firebase.firestore().collection('busyDates').doc(busyDate.userId);
                    return transaction.get(docRef).then((doc) => {
                        transaction.set(docRef, {busy: busyDate.busy}, {merge: true});
                    });
                });
                return Promise.all(results);
            }).then((response) => {
                subscriber.next(true);
            }).catch((err) => {
                subscriber.error(false);
            });
        });
    }

    public static getBusyDates(userIds?: Array<string>): Observable<ServiceResponse<Array<BusyDateDto>>> {

        return new Observable((subscriber) => {
            firebase.firestore().collection('busyDates').onSnapshot((snapshot) => {

                const busyDates = snapshot.docs.map((doc) => ({
                    userId: doc.id,
                    busy: doc.data().busy
                }));

                if(userIds){
                    subscriber.next({
                        success: true,
                        data: busyDates.filter(u => userIds.includes(u.userId))
                    });
                } else {
                    subscriber.next({
                        success: true,
                        data: busyDates
                    });
                }

            }, (error) => {
                subscriber.next({
                    success: false,
                    error: 'Error collecting busy dates: ' + error,
                    data: []
                });
            });
        });
    }

    public static getEvents(user: User): Observable<ServiceResponse<Array<GroupedEventDto>>> {

        return new Observable((subscriber) => {
            firebase.firestore().collection('events').onSnapshot((snapshot) => {

                let groupedEvents: Array<GroupedEventDto> = snapshot.docs.map((doc) => ({
                    events: doc.data().events,
                    from: doc.data().from,
                    to: doc.data().to,
                    groupName: doc.data().groupName
                }));

                groupedEvents = assignColor(groupedEvents);

                if(user.role === Role.ADMIN){
                    subscriber.next({
                        success: true,
                        data: groupedEvents
                    });
                } else {
                    subscriber.next({
                        success: true,
                        data: filterEventsByUser(groupedEvents, user)
                    });
                }
            }, (error) => {
                subscriber.next({
                    success: false,
                    error: 'Error collecting events: ' + error,
                    data: []
                });
            });
        });
    }

    public static updateEventsFromGroupedEvent(newEvents: Array<EventDto>, groupName: string): Observable<boolean> {

        return new Observable((subscriber) => {

            const docRef = firebase.firestore().collection('events').doc(groupName);

            firebase.firestore().runTransaction((transaction) => {
                return transaction.get(docRef).then((doc) => {
                    if (!doc.exists) {
                        subscriber.next(false);
                    }else{
                        const events = doc.data()?.events.map((event: EventDto) => {
                            const modifiedEvent = newEvents.find(modified => modified.id === event.id);
                            return modifiedEvent || event;
                        });
                        transaction.set(docRef, {events}, {merge: true});
                    }
                });
            }).then((response) => {
                subscriber.next(true);
            }).catch((err) => {
                subscriber.error(false);
            });
        });
    }
}


export class MockEventService {
    private static busyDatesSubject = new BehaviorSubject(busyDates.slice());
    private static groupedEventsSubject = new BehaviorSubject(groupedEvents.slice());

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

    public static updateBusyDates(modified: Array<BusyDateState>): Observable<boolean> {
        modified.forEach((m) => {
            let index = busyDates.findIndex((busy) => busy.userId ===  m.userId);

            if(index > -1) {
                busyDates.splice(index, 1);
                busyDates.splice(index, 0, m);
            }
        });

        this.busyDatesSubject.next(busyDates.slice());
        return of(true);
    }

    public static getBusyDates(userIds?: Array<string>): Observable<ServiceResponse<Array<BusyDateDto>>> {

        if(!userIds) {
            return this.busyDatesSubject.pipe(
                delay(100),
                map(dto => ({success: true, data: dto}))
            );
        }

        return this.busyDatesSubject.pipe(
            delay(200),
            map((dto: Array<BusyDateDto>) => dto.filter(bd => userIds.includes(bd.userId))),
            map(dto => ({success: true, data: dto}))
        );
    }

    public static getEvents(user: User): Observable<ServiceResponse<Array<GroupedEventDto>>> {

        if(user.role === Role.ADMIN) {
            return this.groupedEventsSubject.pipe(
                delay(500),
                map((groupedEvents: Array<GroupedEventDto>) => assignColor(groupedEvents)),
                map((groupedEvents: Array<GroupedEventDto>) => ({success: true, data: groupedEvents}))
            );
        }

        return this.groupedEventsSubject.pipe(
            delay(500),
            map((groupedEvents: Array<GroupedEventDto>) => filterEventsByUser(groupedEvents, user)),
            map((groupedEvents: Array<GroupedEventDto>) => assignColor(groupedEvents)),
            map((groupedEvents: Array<GroupedEventDto>) => ({success: true, data: groupedEvents}))
        );
    }

    public static updateEventsFromGroupedEvent(modified: Array<EventDto>, groupName: string): Observable<boolean> {

        let index = groupedEvents.findIndex((groupedEvent) => groupedEvent.groupName === groupName);

        if(index > -1) {
            groupedEvents[index].events = groupedEvents[index].events.map((ev) => {
                const isModified = modified.find(mod => mod.id === ev.id);
                return isModified || ev;
            });
        }

        this.groupedEventsSubject.next(groupedEvents.slice());
        return of(true);
    }
}