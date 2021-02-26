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
export const selectBusyDatesOtherUsers = (state: RootState) => state.planner.busyDatesOtherUsers.filter((user) => state.planner.selectedParticipants.includes(user.userId)).flatMap((user) => {

    const u = state.planner.participants.find(participant => participant.id === user.userId);

    return user.busy.map((date: BusyState) => {
        return {
            ...date,
            start: DateTime.fromFormat(date.start, DATE_TIME_FORMAT).toJSDate(),
            end: DateTime.fromFormat(date.end, DATE_TIME_FORMAT).toJSDate(),
            textColor: 'black',
            color: u?.color,
            title: u?.name + ' está ocupado/a',
            canDelete: false,
        }
    });
});

export const selectParticipants = (state: RootState) => state.planner.participants.filter(p => {
    const busyDatesOU = state.planner.busyDatesOtherUsers.find(bd => bd.userId === p.id);
    if(busyDatesOU) {
        return busyDatesOU.busy.length > 0
    }
    return false;
});

export const selectSelectedParticipants = (state: RootState) => state.planner.selectedParticipants;

export const selectEvents = (state: RootState) => state.planner.events;