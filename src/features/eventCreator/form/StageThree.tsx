import {useDispatch, useSelector} from 'react-redux';
import {
    addTutor,
    removeTutor,
    selectParticipants,
    selectTutorNumber,
    setParticipants
} from '../../../app/eventCreatorSlice';
import React from 'react';
import {Typography} from '@material-ui/core';
import TextInput from '../../../components/textInput/TextInput';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';

export function StageThree() {
    const dispatch = useDispatch();
    const tutorNumber = useSelector(selectTutorNumber);
    const participants = useSelector(selectParticipants).map((p, index) => {
        return (
            <div key={index} className={'Question'}>
                <Typography color={'primary'} display={'block'} variant={'h3'}>{p.tag}</Typography>
                <TextInput fullWidth={true} placeholder={p.tag} value={p.email.value} onChange={(value) => dispatch(setParticipants({value: value, tag: p.tag}))}/>
            </div>
        );
    });

    return (
        <div className={'Body'}>
            {participants}
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