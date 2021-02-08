import {createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {DateTime} from 'luxon';
import {RootState} from './store';
import {requesting} from './uiStateSlice';
import EventService, {CreateResponse} from '../services/eventService';

enum ParticipantType {
    PRESIDENTE_TT = 'Presidente Tribunal Titular',
    SECRETARIO_TT = 'Secretario Tribunal Titular',
    VOCAL_TT = 'Vocal Tribunal Titular',
    PRESIDENTE_TS = 'Presidente Tribunal Suplente',
    SECRETARIO_TS = 'Secretario Tribunal Suplente',
    VOCAL_TS = 'Vocal Tribunal Suplente',
    TUTOR = 'Tutor'
}
export const DATE_FORMAT = 'dd-MM-yyyy';

const createDefaultEvent = (): EventState => {
    return {
        id: Math.random(),
        name: createFieldState(''),
        participants: Object.keys(ParticipantType).map((k: string) => ( { email: createFieldState(''), tag: (ParticipantType as any)[k] })),
        duration: createFieldState(60)
    };
};

const createFieldState = (initialValue: any): FieldState<any> => ({
    value: initialValue,
    errorMessage: '',
});

interface FieldState<T> {
    value: T;
    errorMessage: string;
}

interface EventState {
    id: number;
    name: FieldState<string>;
    participants: Array<{
        email: FieldState<string>;
        tag: string;
    }>;
    duration: FieldState<number>;
}

interface EventCreatorState {
    stage: number;
    currentIndex: number;
    groupName: FieldState<{
        label: string;
        value: string;
    }>;
    from: FieldState<string>;
    to: FieldState<string>;
    events: Array<EventState>;
}
enum errorMessages {
    EMPTY = 'El campo no puede estar vacío.',
    SHORT = 'El valor del campo es demasiado corto.',
    FORMAT = 'El valor del campo no tiene un formato válido.',
    DURATION = 'La duración del evento debe ser de entre 10 y 300 minutos.',
    DATES = 'La fecha de finalización del periodo no puede ser mayor que la de comienzo'
}

const validationRules = {
    name: (value: string): string => {
        if (value.length === 0) {
            return errorMessages.EMPTY
        }
        if (value.length < 5) {
            return errorMessages.SHORT
        }
        return '';
    },
    duration: (value: number): string => {
        if (value < 10 || value > 300) {
            return errorMessages.DURATION
        }
        return '';
    },
    from: (from: string, to: string): string => {
        return '';
    },
    to: (to: string, from: string): string => {
        const toLuxon = DateTime.fromFormat(to, DATE_FORMAT);
        const fromLuxon = DateTime.fromFormat(from, DATE_FORMAT);
        return toLuxon.diff(fromLuxon, ['days']).days > 0 ? '' : errorMessages.DATES;
    },
    groupName: (value: string): string => {
        if (value.length === 0) {
            return errorMessages.EMPTY
        }
        if (value.length < 5) {
            return errorMessages.SHORT
        }
        return '';
    },
    participant: (value: string): string => {
        if (value.length === 0) {
            return errorMessages.EMPTY
        }
        if(!new RegExp(/.+\@.+\..+/).test(value)) {
            return errorMessages.FORMAT
        }
        return '';
    }
};

export const slice = createSlice({
    name: 'eventCreator',
    initialState: {
        stage: 0,
        currentIndex: 0,
        groupName: createFieldState({label: '', value: ''}),
        from: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        to: createFieldState(DateTime.utc().toFormat(DATE_FORMAT)),
        events: [createDefaultEvent()]
    } as EventCreatorState,
    reducers: {
        next: state => {
            let hasErrors = false;
            switch(state.stage) {
                case 0:
                    const nameError = validationRules.name(state.events[state.currentIndex].name.value);
                    const durationError = validationRules.duration(state.events[state.currentIndex].duration.value);

                    state.events[state.currentIndex].name.errorMessage = nameError;
                    state.events[state.currentIndex].duration.errorMessage = durationError;

                    hasErrors = !!nameError || !!durationError;
                    break;
                case 1:
                    const fromError = validationRules.from(state.from.value, state.to.value);
                    const toError = validationRules.to(state.to.value, state.from.value);
                    const groupNameError = validationRules.groupName(state.groupName.value.label);

                    state.from.errorMessage = fromError;
                    state.to.errorMessage = toError;
                    state.groupName.errorMessage = groupNameError;

                    hasErrors = !!fromError || !!toError || !!groupNameError;
                    break;
                case 2:
                    state.events[state.currentIndex].participants.forEach((p, i) => {
                        state.events[state.currentIndex].participants[i].email.errorMessage = validationRules.participant(p.email.value);
                    });

                    hasErrors = state.events[state.currentIndex].participants.reduce((acc: boolean, current) => {
                        if(acc) return true;
                        return !!current.email.errorMessage;
                    }, false);

                    break;
            }

            if (hasErrors) return;

            if(state.events.length > 1 && state.stage === 0 && state.currentIndex !== 0){
                state.stage = 2;
            }else{
                state.stage += 1;
            }
        },
        previous: state => {
            state.stage -= 1;
        },
        setName: (state, action) => {
            state.events[state.currentIndex].name.value = action.payload;
        },
        setDuration: (state, action) => {
            state.events[state.currentIndex].duration.value = action.payload;
        },
        setFrom: (state, action) => {
            state.from.value = action.payload;
        },
        setTo: (state, action) => {
            state.to.value = action.payload;
        },
        setParticipants: (state, action) => {
            const index = action.payload.index;
            state.events[state.currentIndex].participants[index] = {
                ...state.events[state.currentIndex].participants[index],
                email: {
                    value: action.payload.value,
                    errorMessage: ''
                }
            };
        },
        setGroupName: (state, action) => {
            state.groupName.value = action.payload;
        },
        addTutor: (state) => {
            state.events[state.currentIndex].participants.push({email: createFieldState(''), tag: 'Tutor'});
        },
        removeTutor: (state) => {
            state.events[state.currentIndex].participants.pop();
        },
        createNew: (state) => {
            state.events = [...state.events, createDefaultEvent()];
            state.currentIndex = state.currentIndex + 1;
            state.stage = 0;
        },
        complete: (state) => {
            state.events = [createDefaultEvent()];
            state.stage = 0;
            state.currentIndex = 0;
        },
        setImportedData: (state,action) => {
            state.events = action.payload.events;
            state.groupName = action.payload.groupName;
            state.from = action.payload.from;
            state.to = action.payload.to;
            state.stage = 3;
        },
        editEvent: (state,action: PayloadAction<{stage?: number, currentIndex: number}>) => {
            state.stage = action.payload.stage !== undefined ? action.payload.stage : 0;
            state.currentIndex = action.payload.currentIndex;
        },
    },
});

export const { next, previous, setFrom, setTo, setName, createNew, complete, setParticipants, addTutor, removeTutor, setImportedData, setGroupName, setDuration, editEvent } = slice.actions;

export const createEvents = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requesting());
    const { eventCreator } = getState();
    EventService.create(mapEvents(eventCreator.events)).subscribe((response: CreateResponse) => {
        if(response.success){
            dispatch(complete());
        }
    });
};

export const exportJSON = () => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const data = JSON.stringify(mapStateToJSON(state));
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);

    let link: any = document.createElement('a');
    if(link.download !== undefined) {
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'temp.json');
        link.click();
        link = null;
    }
};

export const importJSON = (files: any) => (dispatch: Dispatch<any>, getState: () => RootState) => {
    const fr = new FileReader();
    console.log(files);
    if(files.length <= 0) return false;
    fr.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        console.log('lalala data', data);
        dispatch(setImportedData(mapJSONToState(data)));
    }
    fr.readAsText(files[0]);
};

export const selectStage = (state: RootState) => state.eventCreator.stage;
export const selectGroupName = (state: RootState) => state.eventCreator.groupName;
export const selectEvents = (state: RootState) => state.eventCreator.events;
export const selectParticipants = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].participants;
export const selectName = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].name;
export const selectDuration = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].duration;
export const selectFrom = (state: RootState) => state.eventCreator.from;
export const selectTo = (state: RootState) => state.eventCreator.to;
export const selectIsLastStage = (state: RootState) => state.eventCreator.stage === 3;
export const selectIsFirstStage = (state: RootState) => state.eventCreator.stage === 0;
export const selectTutorNumber = (state: RootState) => state.eventCreator.events[state.eventCreator.currentIndex].participants.reduce((acc, current) => {
    let newAcc = acc;
    if(current.tag === ParticipantType.TUTOR) newAcc += 1;
    return newAcc;
}, 0);

const mapEvents = (events: Array<any>) => {
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

const mapJSONToState = (data: any) => {
    return {
        from: {value: data.desde},
        to: {value: data.hasta},
        events: mapEventsToState(data.eventos),
        groupName: {label: data.nombreGrupoEventos, value: data.nombreGrupoEventos},
    }
};

const mapEventsToState = (events: Array<any>) => {
    return events.map((event) => {
        return {
            name: {value: event.nombre},
            duration: {value: event.duracion},
            participants: event.participantes.map((p: any) => ({email: {value: p.email}, tag: p.tag}))
        };
    });
};

const mapStateToJSON = (state: RootState) => {
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

export default slice.reducer;