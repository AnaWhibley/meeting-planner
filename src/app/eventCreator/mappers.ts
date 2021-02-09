import {RootState} from '../store';
import {EventState} from './slice';

export const mapEvents = (events: Array<any>) => {
    return events.map((event) => {
        return {
            id: event.id,
            groupName: event.groupName,
            name: event.name.value,
            participants: event.participants,
            duration: event.duration.value
        };
    });
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

export const mapStateToJSON = (state: RootState) => {
    return {
        usuario: state.login.username,
        eventos: mapEventsToJSON(state.eventCreator.events),
        nombreGrupoEventos: state.eventCreator.groupName?.value.label,
        desde: state.eventCreator.from.value,
        hasta: state.eventCreator.to.value,
    };
};

const mapEventsToJSON = (events: Array<EventState>) => {
    return events.map((event) => {
        return {
            nombre: event.name.value,
            duracion: event.duration.value,
            participantes: event.participants.map((p: any) => ({email: p.email.value, tag: p.tag}))
        };
    });
};