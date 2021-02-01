import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import {Typography} from '@material-ui/core';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import {Color} from '../../styles/theme';
import {useHistory} from 'react-router-dom';
import {ReactComponent as CalendarCreateIcon} from '../../assets/icons/evericons/calendar-create.svg';
import wizard from '../../assets/icons/undraw/undraw_setup_wizard.svg';
import DragAndDrop from '../../components/dragAndDrop/DragAndDrop';

export function CreateEvents() {

    const history = useHistory();

    return (
        <>
            <NavBar/>
            <div className={'DashboardContainer'}>
                <Typography variant='h1' color={Color.PRIMARY} display={'block'} align={'center'}>¿Cómo quieres crear tu evento?</Typography>
                <Typography variant='subtitle1' display={'block'} align={'center'}>Crear eventos nunca ha sido tan fácil.</Typography>
                <div className={'DashboardButtonsContainer'}>
                    <div className={'DashboardButtonWrapper DashboardButtonLeft'}>
                        <ActionButton color={Color.PRIMARY}
                                      onClick={() => history.push('/wizard')}
                                      innerText={'Crear un evento manualmente'}
                                      variant={ButtonVariant.CONTAINED}
                                      labelClassName={'DashboardButton'}
                                      icon={<CalendarCreateIcon className={'FillWhite'}/>}
                        />
                        <img src={wizard} alt="" className={'DashboardImage'}/>
                    </div>
                    <div className={'DashboardButtonWrapper DashboardButtonRight'}>
                        <DragAndDrop/>
                    </div>
                </div>
            </div>
        </>
    );
}