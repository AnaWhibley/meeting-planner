import {useSelector} from 'react-redux';
import {RootState} from '../../../app/store';
import {selectFrom} from '../../../app/eventCreatorSlice';
import React from 'react';

export function SummaryStage() {
    const events = useSelector((state:RootState) => state.eventCreator.events);
    const from = useSelector(selectFrom).value;

    const elements = events.map(e => {
        return (
            <div key={e.id}>
                <span>Nombre del evento: {e.name.value}</span><br/>
            </div>
        );
    });

    return (
        <div className={'Body'}>
            <span>Fechas: {from}</span>
            {elements}
        </div>
    );
}