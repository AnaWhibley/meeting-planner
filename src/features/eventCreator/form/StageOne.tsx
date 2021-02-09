import {useDispatch, useSelector} from 'react-redux';
import {
    setDuration,
    setName,
} from '../../../app/eventCreator/eventCreatorSlice';
import React from 'react';
import {Typography} from '@material-ui/core';
import {DurationPicker} from '../../../components/durationPicker/DurationPicker';
import TextInput from '../../../components/textInput/TextInput';
import {selectDuration, selectName } from '../../../app/eventCreator/selectors';

export function StageOne() {
    const name = useSelector(selectName);
    const duration = useSelector(selectDuration);
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
                           error={!!name.errorMessage}
                           errorMessage={name.errorMessage}
                           value={name.value}
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
                <DurationPicker value={duration.value}
                                className={'Input'}
                                error={!!duration.errorMessage}
                                errorMessage={duration.errorMessage}
                                onChange={duration => dispatch(setDuration(duration))}/>
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