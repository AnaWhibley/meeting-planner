import {useDispatch, useSelector} from 'react-redux';
import {selectName, setName} from '../../../app/eventCreatorSlice';
import React from 'react';
import { Typography } from '@material-ui/core';
import TextInput from '../../../components/textInput/TextInput';

export function StageOne() {
    const name = useSelector(selectName);
    const dispatch = useDispatch();
    return (
        <div>
            <Typography color={'primary'} variant={'h3'} display={'block'}>¿Cómo se llamará el evento?</Typography>
            <TextInput type="text" value={name.value} placeholder={'Nombre del evento'} onChange={(value) => dispatch(setName(value))}/>
        </div>
    );
}