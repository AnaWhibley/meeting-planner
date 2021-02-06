import {useDispatch, useSelector} from 'react-redux';
import {
    selectDuration,
    selectName,
    setDuration,
    setName,
} from '../../../app/eventCreatorSlice';
import React from 'react';
import {Typography} from '@material-ui/core';
import {DurationPicker} from '../../../components/durationPicker/DurationPicker';
import TextInput from '../../../components/textInput/TextInput';

export function StageOne() {
    const name = useSelector(selectName).value;
    const duration = useSelector(selectDuration).value;
    const dispatch = useDispatch();

    return (
        <div className={'Body'}>
            <div className={'Question'}>
                <Typography color={'primary'}
                            variant={'h3'}
                            display={'block'}>
                    ¿Cómo se llamará el evento?
                </Typography>
                <TextInput type='text'
                           value={name}
                           placeholder={'Nombre del evento'}
                           fullWidth={true}
                           className={'Input'}
                           onChange={(value) => dispatch(setName(value))}
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