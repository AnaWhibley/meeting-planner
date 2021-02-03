import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    addTutor,
    createEvents,
    createNew, DATE_FORMAT, exportJSON,
    next,
    previous,
    removeTutor,
    selectFrom, selectIsFirstStage,
    selectIsLastStage,
    selectName, selectParticipants,
    selectStage, selectTo,
    selectTutorNumber,
    setFrom,
    setName,
    setParticipants,
    setTo
} from '../../../app/eventCreatorSlice';
import {DateTime} from 'luxon';
import { NavBar } from '../../../components/navigationBar/NavBar';
import {RootState} from '../../../app/store';

export function Form() {
    const stage = useSelector(selectStage);
    const isLastStage = useSelector(selectIsLastStage);
    const isFirstStage = useSelector(selectIsFirstStage);

    const dispatch = useDispatch();
    let body;
    switch (stage) {
        case 0:
            body = <StageOne/>;
            break;
        case 1:
            body = <StageTwo/>;
            break;
        case 2:
            body = <StageThree/>;
            break;
        case 3:
            body = <SummaryStage/>;
            break;
        default:
            throw new Error('Unknown step');
    }
    return (
        <div>
            <div>
                <NavBar/>
                {body}
            </div>
            {!isFirstStage ? <button onClick={() => dispatch(previous())}>atras</button> : null}
            <button onClick={() => {
                if(isLastStage) {
                    dispatch(createEvents())
                }else{
                    dispatch(next())
                }
            }}>{isLastStage ? 'confirmar' : 'siguiente'}</button>
            {isLastStage ?  <button onClick={() => dispatch(createNew())}>Nuevo</button>: null}
            {isLastStage ?  <button onClick={() => dispatch(exportJSON())}>Exportar</button>: null}
        </div>
    );
}

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

export function StageTwo() {
    const from = DateTime.fromFormat(useSelector(selectFrom).value, DATE_FORMAT);/*19-12-2012*/
    const to = DateTime.fromFormat(useSelector(selectTo).value, DATE_FORMAT);
    const dispatch = useDispatch();
    const today = DateTime.utc();

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

            <div>{from.diff(today).milliseconds > 0 ? 'Is after' : 'Not is after'}</div>
        </div>
    );
}

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

export function SummaryStage() {
    const events = useSelector((state:RootState) => state.eventCreator.events);
    const from = useSelector(selectFrom).value;

    const elements = events.map(e => {
        return (
            <div>
                <span>Nombre del evento: {e.name.value}</span><br/>
            </div>
        );
    });

    return (
        <div>
            <span>Fechas: {from}</span>
            {elements}
        </div>
    );
}