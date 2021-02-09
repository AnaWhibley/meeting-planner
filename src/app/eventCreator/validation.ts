import {DateTime} from 'luxon';
import {DATE_FORMAT, EventCreatorState} from './slice';

enum errorMessages {
    EMPTY = 'Campo requerido',
    SHORT = 'El valor es demasiado corto',
    FORMAT = 'El valor no tiene un formato válido',
    DURATION = 'La duración debe ser de entre 10 y 300 minutos',
    DATES = 'La fecha de finalización debe ser mayor que la de comienzo'
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

export const validateFields = (state: EventCreatorState) => {
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

    return hasErrors;
};