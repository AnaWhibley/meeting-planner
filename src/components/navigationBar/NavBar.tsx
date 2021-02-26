import React from 'react';
import {useHistory} from 'react-router-dom';
import Menu from '../../components/menu/Menu';
import {ReactComponent as ProfileIcon} from '../../assets/icons/evericons/user.svg';
import {ReactComponent as CalendarCreateIcon} from '../../assets/icons/evericons/calendar-create.svg';
import {ReactComponent as CalendarDatesIcon} from '../../assets/icons/evericons/calendar-dates.svg';
import {ReactComponent as SignOutIcon} from '../../assets/icons/evericons/share-arrow.svg';
import {useSelector} from 'react-redux';
import {Role} from '../../services/userService';
import logo from '../../assets/images/logo.svg';
import './NavBar.scss';
import {selectLoggedInUser} from '../../app/login/selectors';
import {Typography} from '@material-ui/core';
import {AvatarInitials} from '../avatarInitials/AvatarInitials';

export function NavBar(props: {view?: string}) {

    const history = useHistory();
    const loggedInUser = useSelector(selectLoggedInUser);

    const menuItems = [{
        label: 'Mi perfil',
        icon: <ProfileIcon/>,
        onClick: () => history.push('/profile')
    }, {
        label: 'Calendario de eventos',
        icon: <CalendarDatesIcon/>,
        onClick: () => history.push('/')
    }, {
        label: 'Cerrar sesión',
        icon: <SignOutIcon className={'SignOutIcon'}/>,
        onClick: () => history.push('/login')
    }];

    if(loggedInUser && loggedInUser.role === Role.ADMIN) {
        menuItems.splice(1, 0,
            {
                label: 'Crear eventos',
                icon: <CalendarCreateIcon/>,
                onClick: () => history.push('/createEvents')
            }
        );
    }

    return (
        <div className={'NavBarContainer'}>
            <img src={logo}
                 alt="Logo MeetingPlanner"
                 className={'Logo'}
                 onClick={() => loggedInUser && loggedInUser.role === Role.ADMIN ? history.push('/dashboard') : history.push('/')}/>
            <Menu menuItems={menuItems} className={'Menu'}/>
            {props.view === 'Planner' || props.view === 'Profile' ? <div className={'AvatarName'}>
                <div className={'Avatar'}><AvatarInitials text={loggedInUser?.name || ''}/></div>
                <Typography variant="subtitle1"
                            display={'inline'}
                            color='textSecondary'>
                    {loggedInUser?.name}
                </Typography>
            </div> : null}

        </div>
    );

}