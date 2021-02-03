import {useDispatch, useSelector} from 'react-redux';
import {
    addTutor,
    removeTutor,
    selectParticipants,
    selectTutorNumber,
    setParticipants
} from '../../../app/eventCreatorSlice';
import React from 'react';

export function StageThree() {
    const dispatch = useDispatch();
    const tutorNumber = useSelector(selectTutorNumber);
    const participants = useSelector(selectParticipants).map((p, index) => {
        return (
            <div key={index}>
                <span>{p.tag}</span>
                <input type="text" placeholder={p.tag} onChange={ (event) => dispatch(setParticipants({value: event.target.value, tag: p.tag}))}/><br/>
            </div>
        );
    });

    return (
        <div>
            {participants}
            {tutorNumber === 2 ? <button onClick={() => dispatch(removeTutor())}>Eliminar tutor</button> : null}
            {tutorNumber === 1 ? <button onClick={() => dispatch(addTutor())}>Añadir tutor</button> : null}
        </div>
    );
}