import {useDispatch, useSelector} from 'react-redux';
import {selectName, setName} from '../../../app/eventCreatorSlice';
import React from 'react';

export function StageOne() {
    const name = useSelector(selectName);
    const dispatch = useDispatch();
    return (
        <div>
            <span>{name.errorMessage}</span>
            <input type="text" value={name.value} placeholder={'Nombre del evento'} onChange={(ev) => dispatch(setName(ev.target.value))}/>
        </div>
    );
}