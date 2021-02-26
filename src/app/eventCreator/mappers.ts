import {RootState} from '../store';
import {EventCreatorSlice, EventState} from './slice';
import {GroupedEventDto} from '../../services/eventService';

export const mapToCreateEventRequest = (state: EventCreatorSlice): GroupedEventDto => {
    const events = state.events.map((event) => {
        return {
            id: event.id,
            name: event.name.value,
            participants: event.participants.map(p => ({email: p.email.value, tag: p.tag})),
            duration: event.duration.value,
            status: event.status,
            date: event.date,
            time: event.time
        };
    });

    return {
        groupName: state.groupName.value.label,
        from: state.from.value,
        to: state.to.value,
        events
    }
};

export const mapJSONToState = (data: any) => {
    return {
        from: {value: data.desde},
        to: {value: data.hasta},
        events: mapJSONEventsToState(data.eventos),
        groupName: {label: data.nombreGrupoEventos, value: data.nombreGrupoEventos},
    }
};

const mapJSONEventsToState = (events: Array<any>) => {
    return events.map((event) => {
        return {
            name: {value: event.nombre},
            duration: {value: event.duracion},
            participants: event.participantes.map((p: any) => ({email: {value: p.email}, tag: p.tag}))
        };
    });
};

export const mapJSONFromState = (state: RootState) => {
    return {
        eventos: mapJSONToStateEvents(state.eventCreator.events),
        nombreGrupoEventos: state.eventCreator.groupName?.value.label,
        desde: state.eventCreator.from.value,
        hasta: state.eventCreator.to.value,
    };
};

const mapJSONToStateEvents = (events: Array<EventState>) => {
    return events.map((event) => {
        return {
            nombre: event.name.value,
            duracion: event.duration.value,
            participantes: event.participants.map((p: any) => ({email: p.email.value, tag: p.tag}))
        };
    });
};