import React from 'react';
import {useHistory} from 'react-router-dom';
import Menu from '../../components/menu/Menu';
import {ReactComponent as ProfileIcon} from '../../assets/icons/user.svg';
import {ReactComponent as CalendarCreateIcon} from '../../assets/icons/calendar-create.svg';
import {ReactComponent as CalendarDatesIcon} from '../../assets/icons/calendar-dates.svg';
import {ReactComponent as SignOutIcon} from '../../assets/icons/share-arrow.svg';
import {useSelector} from 'react-redux';
import {selectLoggedInUser} from '../../app/loginSlice';
import {Role} from '../../services/userService';
import './NavBar.scss';

export function NavBar() {

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
        onClick: () => history.push('/wizard')
    }];

    if(loggedInUser && loggedInUser.role === Role.ADMIN) {
        menuItems.splice(1, 0,
            {
                label: 'Crear eventos',
                icon: <CalendarCreateIcon/>,
                onClick: () => history.push('/wizard')
            }
        );
    }

    return (
        <>
            <Menu menuItems={menuItems}/>
        </>
    );

}