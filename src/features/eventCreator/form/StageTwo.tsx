import {DateTime} from 'luxon';
import {useDispatch, useSelector} from 'react-redux';
import {DATE_FORMAT, selectDuration, selectFrom, selectTo, setDuration, setFrom, setTo} from '../../../app/eventCreatorSlice';
import React from 'react';
import {Typography} from '@material-ui/core';
import {DatePicker} from '../../../components/datePicker/DatePicker';
import {DurationPicker} from '../../../components/durationPicker/DurationPicker';

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const duration = useSelector(selectDuration).value;
    const dispatch = useDispatch();

    return (
        <div className={'Body'}>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Entre qué fechas se podrá desarrollar el evento o el grupo de eventos?
                </Typography>
                <DatePicker value={from}
                            className={'Input DatePicker'}
                            label={'Desde'}
                            onChange={(date: DateTime) => {dispatch(setFrom(date.toFormat(DATE_FORMAT)))}}
                />
                <DatePicker value={to}
                            className={'Input DatePicker'}
                            label={'Hasta'}
                            onChange={(date: DateTime) => {dispatch(setTo(date.toFormat(DATE_FORMAT)))}}
                />
            </div>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Cuánto durará este evento?
                </Typography>
                <DurationPicker value={duration} className={'Input'} onChange={duration => dispatch(setDuration(duration))}/>
                <Typography color={'textPrimary'}
                            variant={'h3'}
                            className={'MinutesLabel'}
                >
                    minutos
                </Typography>
            </div>
        </div>
    );
}