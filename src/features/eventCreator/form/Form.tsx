import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    createEvents,
    createNew,
    exportJSON,
    next,
    previous,
} from '../../../app/eventCreator/slice';
import {NavBar} from '../../../components/navigationBar/NavBar';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {StageOne} from './StageOne';
import { StageTwo } from './StageTwo';
import {StageThree} from './StageThree';
import { SummaryStage } from './SummaryStage';
import {Step, StepLabel, Stepper, Typography} from '@material-ui/core';
import './Form.scss'
import {
    selectIsConfirmationStage,
    selectIsStageOne,
    selectIsSummaryStage,
    selectStage
} from '../../../app/eventCreator/selectors';
import {ConfirmationStage} from './ConfirmationStage';

export function Form() {
    const stage = useSelector(selectStage);
    const isSummaryStage = useSelector(selectIsSummaryStage);
    const isConfirmationStage = useSelector(selectIsConfirmationStage);
    const isFirstStage = useSelector(selectIsStageOne);
    const dispatch = useDispatch();

    const steps = [1,2,3,4];

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
        case 4:
            body = <ConfirmationStage/>;
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
                        {steps.map((label, index) => {
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
                    {!isFirstStage && !isConfirmationStage ?
                        <ActionButton onClick={() => dispatch(previous())}
                                      innerText={'Atrás'}
                                      color={Color.PRIMARY}
                                      className={'Button'}
                                      variant={ButtonVariant.OUTLINED}/>
                        : null}

                    {!isConfirmationStage && !isSummaryStage ?
                        <ActionButton onClick={() => dispatch(next())}
                                      innerText={'Siguiente'}
                                      className={'Button'}
                                      variant={ButtonVariant.CONTAINED}
                                      color={Color.PRIMARY}/>
                        : null
                    }

                    {isSummaryStage ?
                        <ActionButton onClick={() => dispatch(createEvents())}
                                      className={'Button'}
                                      color={Color.PRIMARY}
                                      innerText={'Finalizar'}
                                      variant={ButtonVariant.CONTAINED}/>
                        : null}

                    {isSummaryStage ?
                        <ActionButton onClick={() => dispatch(createNew())}
                                      className={'Button'}
                                      color={Color.PRIMARY}
                                      innerText={'Añadir otro evento'}
                                      variant={ButtonVariant.CONTAINED}/>
                        : null}
                </div>
            </div>
        </>
    );
}