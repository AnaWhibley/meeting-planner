import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import {Typography} from '@material-ui/core';
import {User} from '../../services/userService';
import {useSelector} from 'react-redux';
import {selectLoggedInUser} from '../../app/loginSlice';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import {Color} from '../../styles/theme';
import {useHistory} from 'react-router-dom';
import {ReactComponent as CalendarCreateIcon} from '../../assets/icons/evericons/calendar-create.svg';
import {ReactComponent as CalendarDatesIcon} from '../../assets/icons/evericons/calendar-dates.svg';
import choice from '../../assets/icons/undraw/undraw_choice.svg';
import './Dashboard.scss';
import '../../styles/common.scss';


export function Dashboard() {

    const loggedInUser: User | undefined = useSelector(selectLoggedInUser);
    const history = useHistory();

    return (
        <div>
            <NavBar/>
            <Typography variant='subtitle1' display={'block'} align={'center'}>Bienvenido, {loggedInUser?.name}</Typography>
            <Typography variant='h1' color={Color.PRIMARY} display={'block'} align={'center'}>¿Qué quieres hacer?</Typography>
            <div className={'DashboardButtonsContainer'}>
                <div>
                    <ActionButton color={Color.PRIMARY}
                                  onClick={() => history.push('/wizard')}
                                  innerText={'Crear uno o varios eventos'}
                                  variant={ButtonVariant.CONTAINED}
                                  icon={<CalendarCreateIcon className={'FillWhite'}/>}
                    />
                    <Typography variant='subtitle1' align={'center'}>Crea o importa nuevos eventos</Typography>
                </div>
                <div>
                    <ActionButton color={Color.PRIMARY}
                                  onClick={() => history.push('/calendar')}
                                  innerText={'Editar eventos existentes'}
                                  variant={ButtonVariant.OUTLINED}
                                  icon={<CalendarDatesIcon className={'FillPrimary'}/>}
                    />
                    <Typography variant='subtitle1' align={'center'}>Observa, modifica y elimina todos los eventos creados anteriormente</Typography>
                </div>
            </div>
            <img src={choice} alt="" className={'DashboardImage'}/>
        </div>
    );
}