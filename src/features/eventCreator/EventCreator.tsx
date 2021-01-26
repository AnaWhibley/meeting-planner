import React from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    createEvents,
    createNew,
    next,
    previous,
    selectFrom,
    selectIsLastStage,
    selectName,
    selectStage,
    setFrom,
    setName
} from './eventCreatorSlice';
import {DateTime} from 'luxon';

export function EventCreator() {
    const stage = useSelector(selectStage);
    const isLastStage = useSelector(selectIsLastStage);
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
            body = <SummaryStage/>;
            break;
        default:
            throw new Error('Unknown step');
    }
    return (
        <div>
            Wizard <Link to="/profile">Profile</Link>
            <div>
                {body}
            </div>
            <button onClick={() => dispatch(previous())}>atras</button>
            <button onClick={() => {
                if(isLastStage) {
                    dispatch(createEvents())
                }else{
                    dispatch(next())
                }
            }}>{isLastStage ? 'confirmar' : 'siguiente'}</button>
            {isLastStage ?  <button onClick={() => dispatch(createNew())}>Nuevo</button>: null}
        </div>
    );
}

export function StageOne() {
    const name = useSelector(selectName);
    const dispatch = useDispatch();
    return (
        <div>
            <span>{name.errorMessage}</span>

            <input type="text" value={name.value} onChange={(ev) => dispatch(setName(ev.target.value))}/>
        </div>
    );
}

export function StageTwo() {
    const from = DateTime.fromSeconds(useSelector(selectFrom).value);
    const dispatch = useDispatch();

    const today = DateTime.utc();
    console.log('!!!', from.diff(today));

    return (
        <div>
            <input type="date" value={from.toFormat('yyyy-MM-dd')} onChange={(ev) => {
                const selectedDate = DateTime.fromFormat(ev.target.value, 'yyyy-MM-dd');
                dispatch(setFrom(selectedDate.toSeconds()))
            }}/>
            <div>{from.diff(today).milliseconds > 0 ? 'Is after' : 'Not is after'}</div>
        </div>
    );
}

export function SummaryStage() {
    return (
        <div>
            Wizard <Link to="/profile">Profile</Link>
            <div>

            </div>
        </div>
    );
}