import {BusyDateDto, BusyDto, EventDto, GroupedEventDto} from "../services/eventService";
import {DateTime} from 'luxon';
import {DATE_TIME_FORMAT} from '../app/eventCreator/slice';

export interface MockedEvents {
    participants: Array<string>;
    duration: number;
}

// Función que devuelve la estructura de una convocatoria
export function mockGroupedEvent(events: Array<MockedEvents>, from: string, to: string): GroupedEventDto {

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

// Función que devuelve los eventos de una convocatoria después de ser procesado por la búsqueda
export function mockEventsResult(events: Array<EventDto>, data: Map<string, {status: string; date?: string; time?: string}>): Array<EventDto> {
    return events.slice().map(ev => {
        const info = data.get(ev.id);
        if(info) {
            ev.status = info.status;
            ev.date = info.date || '';
            ev.time = info.time || '';
        }
        return ev;
    })
}

// Función que devuelve la estructura de un array de indisponibilidades
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

// Función que devuelve las indisponibilidades después de ser procesado por la búsqueda
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

export const generateBusyDatesResultMap = (events: Array<EventDto>) => {
    const busyDatesResultMap = new Map();
    events.forEach(ev => {

        const dateTime = ev.date + ' ' + ev.time;
        const start = DateTime.fromFormat(dateTime, DATE_TIME_FORMAT);
        const end = start.plus({minutes: ev.duration});
        const busyDate = {eventId: ev.id, start: start.toFormat(DATE_TIME_FORMAT), end: end.toFormat(DATE_TIME_FORMAT)};

        ev.participants.forEach(p => {
            const busyArray = busyDatesResultMap.has(p.email) ? busyDatesResultMap.get(p.email) : [];
            if(busyArray) {
                busyArray.push(busyDate);
                busyDatesResultMap.set(p.email, busyArray);
            }
        });
    });
    return busyDatesResultMap;
};

export const abraham = 'abraham.rodriguez@ulpgc.es';
export const alexis = 'alexis.quesada@ulpgc.es';
export const octavio = 'octavio.mayor@ulpgc.es';
export const domingo = 'domingo.benitez@ulpgc.es';
export const josedaniel = 'daniel.hernandez@ulpgc.es';
export const paqui = 'francisca.quintana@ulpgc.es';
export const juancarlos = 'jc.rodriguezdelpino@ulpgc.es';
export const josemi = 'josemiguel.santos@ulpgc.es';
export const juanca = 'juancarlos.quevedo@ulpgc.es';
export const josejuan = 'josejuan.hernandez@ulpgc.es';
export const julio = 'julio.esclarin@ulpgc.es'
export const idFn = () => '';

