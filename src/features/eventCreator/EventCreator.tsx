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

export function EventCreator() {

    const history = useHistory();

    return (
        <>
            <NavBar/>
            <div className={'EventCreatorContainer'}>
                <Typography variant='h1' color={Color.PRIMARY} display={'block'} align={'center'}>¿Cómo quieres crear tu evento?</Typography>
                <Typography variant='subtitle1' display={'block'} align={'center'}>Crear eventos nunca ha sido tan fácil.</Typography>
                <div className={'EventCreatorButtonsContainer'}>
                    <div className={'EventCreatorButtonWrapper EventCreatorLeft'}>
                        <ActionButton color={Color.PRIMARY}
                                      onClick={() => history.push('/createEvents/form')}
                                      innerText={'Crear un evento manualmente'}
                                      variant={ButtonVariant.CONTAINED}
                                      labelClassName={'EventCreatorButton'}
                                      icon={<CalendarCreateIcon className={'FillWhite'}/>}
                        />
                        <img src={wizard} alt="Ilustración wizard"/>
                    </div>
                    <div className={'EventCreatorButtonWrapper EventCreatorRight'}>
                        <DragAndDrop validFileTypes={['application/json']} labelValidFileTypes={'El formato soportado es'}/>
                    </div>
                </div>
            </div>
        </>
    );
}