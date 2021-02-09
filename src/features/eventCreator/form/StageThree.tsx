import {useDispatch, useSelector} from 'react-redux';
import {
    addTutor,
    removeTutor,
    setParticipants
} from '../../../app/eventCreator/eventCreatorSlice';
import React from 'react';
import {Typography} from '@material-ui/core';
import TextInput from '../../../components/textInput/TextInput';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {selectParticipants, selectTutorNumber} from '../../../app/eventCreator/selectors';

export function StageThree() {
    const dispatch = useDispatch();
    const tutorNumber = useSelector(selectTutorNumber);
    const participants = useSelector(selectParticipants).map((p, index) => {
        return (
            <div key={index} className={'Question'}>
                <TextInput fullWidth={true}
                           placeholder={p.tag}
                           value={p.email.value}
                           error={!!p.email.errorMessage}
                           errorMessage={p.email.errorMessage}
                           onChange={(value) => dispatch(setParticipants({value: value, index}))}/>
            </div>
        );
    });

    return (
        <div className={'Body'}>
            <div className={'Question'}>
                <Typography color={'primary'} display={'block'} variant={'h3'}>Tribunal Titular</Typography>
                {participants.slice(0,3)}
            </div>
            <div className={'Question'}>
                <Typography color={'primary'} display={'block'} variant={'h3'}>Tribunal Suplente</Typography>
                {participants.slice(3,6)}
            </div>
            <div className={'Question'}>
                <Typography color={'primary'} display={'block'} variant={'h3'}>Tutor/es</Typography>
                {participants.slice(6)}
            </div>
            {tutorNumber === 2 ?
                <ActionButton onClick={() => dispatch(removeTutor())}
                              innerText={'Eliminar tutor'}
                              variant={ButtonVariant.OUTLINED}
                              color={Color.PRIMARY}/>
                : null}
            {tutorNumber === 1 ?
                <ActionButton onClick={() => dispatch(addTutor())}
                              innerText={'Añadir tutor'}
                              variant={ButtonVariant.CONTAINED}
                              color={Color.PRIMARY}/>
                : null}
        </div>
    );
}