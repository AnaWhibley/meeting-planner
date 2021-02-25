import {RootState} from '../store';
import {BusyState} from './slice';
import {DateTime} from 'luxon';
import {DATE_TIME_FORMAT} from '../eventCreator/slice';

export const selectBusyDatesCurrentUser = (state: RootState) => state.planner.busyDatesCurrentUser.map((date: BusyState) => {
    return {
        ...date,
        start: DateTime.fromFormat(date.start, DATE_TIME_FORMAT).toJSDate(),
        end: DateTime.fromFormat(date.end, DATE_TIME_FORMAT).toJSDate(),
        title: 'Estás ocupado/a',
        color: '#3788D8',
        textColor: 'black',
        canDelete: true,
        groupId: 'currentUser'
    }
});
export const selectBusyDatesOtherUsers = (state: RootState) => state.planner.busyDatesOtherUsers.filter((user) => state.planner.selectedParticipants.includes(user.userId)).flatMap((user, index) => {

    const name = state.planner.participants.find(participant => participant.id === user.userId)?.name

    return user.busy.map((date: BusyState) => {
        return {
            ...date,
            start: DateTime.fromFormat(date.start, DATE_TIME_FORMAT).toJSDate(),
            end: DateTime.fromFormat(date.end, DATE_TIME_FORMAT).toJSDate(),
            color: colors[index % colors.length],
            textColor: 'black',
            title: name + ' está ocupado/a',
            canDelete: false,
        }
    });
});

export const selectParticipants = (state: RootState) => state.planner.participants;
export const selectSelectedParticipants = (state: RootState) => state.planner.selectedParticipants;

const colors = [
    '#9fd7b3',
    '#F2A49D',
    '#B8AFE7',
    '#86B8D4',
    '#DFE597',
    '#FFDAB7',
    '#FBC0CB',
    '#F69090',
    '#C8B4DD',
    '#B4EBE7'
];