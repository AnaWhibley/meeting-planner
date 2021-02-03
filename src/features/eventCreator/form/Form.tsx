import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    createEvents,
    createNew,
    exportJSON,
    next,
    previous,
    selectIsFirstStage,
    selectIsLastStage,
    selectStage,
} from '../../../app/eventCreatorSlice';
import {NavBar} from '../../../components/navigationBar/NavBar';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {StageOne} from './StageOne';
import { StageTwo } from './StageTwo';
import {StageThree} from './StageThree';
import { SummaryStage } from './SummaryStage';

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

            {!isFirstStage ? <ActionButton onClick={() => dispatch(previous())} innerText={'Atrás'} color={Color.PRIMARY} variant={ButtonVariant.OUTLINED}/> : null}

            <ActionButton onClick={() => {
                if(isLastStage) {
                    dispatch(createEvents())
                }else{
                    dispatch(next())
                }
            }} innerText={isLastStage ? 'Confirmar' : 'Siguiente'} variant={ButtonVariant.CONTAINED} color={Color.PRIMARY}/>

            {isLastStage ?  <ActionButton onClick={() => dispatch(createNew())} color={Color.PRIMARY} innerText={'Nuevo'} variant={ButtonVariant.CONTAINED}/>: null}
            {isLastStage ?  <ActionButton onClick={() => dispatch(exportJSON())} color={Color.PRIMARY} innerText={'Exportar'} variant={ButtonVariant.CONTAINED}/> : null}
        </div>
    );
}