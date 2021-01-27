import React from 'react';
import {useHistory} from 'react-router-dom';
import Menu from '../../components/menu/Menu';
import {ReactComponent as ProfileIcon} from '../../assets/icons/user.svg';
import {ReactComponent as CalendarCreateIcon} from '../../assets/icons/calendar-create.svg';

export function NavBar() {

    const history = useHistory();

    const menuItems = [{
        label: 'Mi perfil',
        icon: <ProfileIcon/>,
        onClick: () => history.push('/profile')
    }, {
        label: 'Crear eventos',
        icon: <CalendarCreateIcon/>,
        onClick: () => history.push('/wizard')
    }]
    return (
        <>
            <Menu menuItems={menuItems}/>
        </>
    );

}