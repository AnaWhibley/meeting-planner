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
        canDelete: true,
        groupId: 'currentUser'
    }
});
export const selectBusyDatesOtherUsers = (state: RootState) => state.planner.busyDatesOtherUsers.flatMap((user, index) => {
    return user.busyDates.map((date: BusyState) => {
        return {
            ...date,
            start: DateTime.fromFormat(date.start, DATE_TIME_FORMAT).toJSDate(),
            end: DateTime.fromFormat(date.end, DATE_TIME_FORMAT).toJSDate(),
            color: colors[index % colors.length],
            title: user.userId + ' está ocupado/a',
            canDelete: false,
        }
    });
});

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