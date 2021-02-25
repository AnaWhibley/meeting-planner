import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import {Typography} from '@material-ui/core';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import {Color} from '../../styles/theme';
import {useHistory} from 'react-router-dom';
import {ReactComponent as CalendarCreateIcon} from '../../assets/icons/evericons/calendar-create.svg';
import wizard from '../../assets/icons/undraw/undraw_setup_wizard.svg';
import DragAndDrop from '../../components/dragAndDrop/DragAndDrop';
import './EventCreator.scss';
import '../../styles/common.scss';
import {useDispatch} from 'react-redux';
import {setInitialState} from '../../app/eventCreator/slice';

export function EventCreator() {

    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <>
            <NavBar/>
            <div className={'EventCreatorContainer'}>
                <Typography variant='h1'
                            color={Color.PRIMARY}
                            display={'block'}
                            align={'center'}>
                    ¿Cómo quieres crear tu evento?
                </Typography>
                <Typography variant='subtitle1'
                            display={'block'}
                            align={'center'}>
                    Crear eventos nunca ha sido tan fácil.
                </Typography>
                <div className={'ButtonsContainer'}>
                    <div className={'Button ButtonLeft'}>
                        <ActionButton color={Color.PRIMARY}
                                      onClick={() => {
                                          dispatch(setInitialState())
                                          history.push('/createEvents/form')
                                      }}
                                      innerText={'Crear un evento manualmente'}
                                      variant={ButtonVariant.CONTAINED}
                                      labelClassName={'Label'}
                                      icon={<CalendarCreateIcon className={'FillWhite'}/>}
                        />
                        <img src={wizard} alt="Ilustración wizard"/>
                    </div>
                    <div className={'Separator'}/>
                    <div className={'Button'}>
                        <DragAndDrop validFileTypes={['application/json']}
                                     labelValidFileTypes={'El formato soportado es'}
                                     history={history}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}