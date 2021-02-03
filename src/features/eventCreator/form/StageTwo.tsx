import {DateTime} from 'luxon';
import {useDispatch, useSelector} from 'react-redux';
import {DATE_FORMAT, selectFrom, selectTo, setFrom, setTo} from '../../../app/eventCreatorSlice';
import React from 'react';

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);/*19-12-2012*/
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const dispatch = useDispatch();

    return (
        <div>

            <input type="date" value={from.toFormat('yyyy-MM-dd')} onChange={(ev) => {
                const selectedDate = DateTime.fromFormat(ev.target.value, 'yyyy-MM-dd');
                dispatch(setFrom(selectedDate.toFormat(DATE_FORMAT)))
            }}/>

            <input type="date" value={to.toFormat('yyyy-MM-dd')} onChange={(ev) => {
                const selectedDate = DateTime.fromFormat(ev.target.value, 'yyyy-MM-dd');
                dispatch(setTo(selectedDate.toFormat(DATE_FORMAT)))
            }}/>
        </div>
    );
}