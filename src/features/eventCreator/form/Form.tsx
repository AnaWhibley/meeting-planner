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
import {Step, StepLabel, Stepper, Typography} from '@material-ui/core';
import './Form.scss'

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
        <>
            <NavBar/>
            <div className={'FormContainer'}>
                <div>
                    <Typography variant='h1'
                                color={Color.PRIMARY}
                                display={'block'}
                                align={'center'}>
                        Simplemente sigue los pasos
                    </Typography>
                    <Stepper activeStep={stage} className={'Stepper'}>
                        {[1,2,3,4].map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={index} {...stepProps}>
                                    <StepLabel {...labelProps}/>
                                </Step>
                            );
                        })}
                    </Stepper>
                </div>
                {body}
                <div className={'ButtonsContainer'}>
                    {!isFirstStage ?
                        <ActionButton onClick={() => dispatch(previous())}
                                      innerText={'Atrás'}
                                      color={Color.PRIMARY}
                                      className={'Button'}
                                      variant={ButtonVariant.OUTLINED}/>
                        : null}

                    <ActionButton onClick={() => {
                        if(isLastStage) {
                            dispatch(createEvents())
                        }else{
                            dispatch(next())
                        }
                    }} innerText={isLastStage ? 'Confirmar' : 'Siguiente'}
                                  className={'Button'}
                                  variant={ButtonVariant.CONTAINED}
                                  color={Color.PRIMARY}
                    />

                    {isLastStage ?
                        <ActionButton onClick={() => dispatch(createNew())}
                                      className={'Button'}
                                      color={Color.PRIMARY}
                                      innerText={'Nuevo'}
                                      variant={ButtonVariant.CONTAINED}/>
                        : null}
                    {isLastStage ?
                        <ActionButton onClick={() => dispatch(exportJSON())}
                                      className={'Button'}
                                      color={Color.PRIMARY}
                                      innerText={'Exportar'}
                                      variant={ButtonVariant.CONTAINED}/>
                        : null}
                </div>
            </div>
        </>
    );
}