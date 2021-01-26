import React from 'react';
import {
    login,
    selectLoggedInUser,
    selectPassword,
    selectShowErrorMessage,
    selectUsername,
    setPassword,
    setUsername
} from '../../app/loginSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {Redirect} from 'react-router-dom';
import {Role, User} from '../../services/userService';
import TextInput from '../../components/textInput/TextInput';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import LockIcon from '@material-ui/icons/Lock';
import {Color} from '../../styles/theme';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';

export function Login() {

    const dispatch: Dispatch<any> = useDispatch();
    const username = useSelector(selectUsername);
    const password = useSelector(selectPassword);
    const showErrorMessage = useSelector(selectShowErrorMessage);
    const loggedInUser: User | undefined = useSelector(selectLoggedInUser);

    if (loggedInUser) {
        if(loggedInUser.role === Role.ADMIN){
            return <Redirect to="/dashboard" />
        } else {
            return <Redirect to="/" />
        }
    }

    return(
        <div>
            { showErrorMessage ? <span>Nombre de usuario o contraseña incorrecto.</span> : null }
            <br/>
            <TextInput
                placeholder="Nombre de usuario"
                value={username}
                icon={<AlternateEmailIcon color={Color.PRIMARY}/>}
                onChange={(value: string) => dispatch(setUsername(value))}
            />
            <TextInput
                placeholder="Contraseña"
                type="password"
                icon={<LockIcon color={Color.PRIMARY}/>}
                value={password}
                onChange={value => dispatch(setPassword(value))}
            />
            <ActionButton
                innerText={'Entrar'}
                color={Color.PRIMARY}
                variant={ButtonVariant.CONTAINED}
                onClick={() => dispatch(login())}
            />
        </div>
    );
}