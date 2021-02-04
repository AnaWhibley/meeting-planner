import {DateTime} from 'luxon';
import {useDispatch, useSelector} from 'react-redux';
import {DATE_FORMAT, selectFrom, selectTo, setFrom, setTo} from '../../../app/eventCreatorSlice';
import React from 'react';
import {Typography} from '@material-ui/core';
import {DatePicker} from '../../../components/datePicker/DatePicker';

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const dispatch = useDispatch();

    return (
        <div className={'Body'}>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>¿Cómo se llamará el evento?
                </Typography>
                <DatePicker value={from}
                            className={'Input'}
                            onChange={(date: DateTime) => {dispatch(setFrom(date.toFormat(DATE_FORMAT)))}}
                />
                <br/>
                <DatePicker value={to}
                            className={'Input'}
                            onChange={(date: DateTime) => {dispatch(setTo(date.toFormat(DATE_FORMAT)))}}
                />

            </div>
        </div>
    );
}