import React from 'react';
import {
    login,
    setPassword,
    setUsername
} from '../../app/login/slice';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {Redirect} from 'react-router-dom';
import {Role, User} from '../../services/userService';
import TextInput from '../../components/textInput/TextInput';
import {Color} from '../../styles/theme';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import './Login.scss';
import logo from '../../assets/images/logo.svg';
import {Typography} from '@material-ui/core';
import {ReactComponent as AtSignIcon} from '../../assets/icons/evericons/at-sign.svg';
import {ReactComponent as KeyIcon} from '../../assets/icons/evericons/key.svg';
import '../../styles/common.scss';
import {selectLoggedInUser, selectPassword, selectShowErrorMessage, selectUsername} from '../../app/login/selectors';

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
        <div className={'LoginFormContainer'}>
            <div className={'Form'}>
                <img src={logo}
                     className={'Logo'}
                     alt="Logo MeetingPlanner"/>
                <TextInput
                    label="Nombre de usuario"
                    fullWidth={true}
                    value={username}
                    icon={<AtSignIcon/>}
                    onChange={(value: string) => dispatch(setUsername(value))}
                    containerClassName={'InputContainer'}
                />
                <TextInput
                    label="Contraseña"
                    fullWidth={true}
                    type="password"
                    icon={<KeyIcon/>}
                    value={password}
                    onChange={value => dispatch(setPassword(value))}
                    containerClassName={'InputContainer'}
                />
                { showErrorMessage ?
                    <Typography variant="subtitle1"
                                display="inline"
                                className={"ErrorMessage"}
                                color={"error"}>
                        Nombre de usuario o contraseña incorrecto.
                    </Typography>
                    : null
                }
                <ActionButton
                    innerText={'Entrar'}
                    color={Color.PRIMARY}
                    variant={ButtonVariant.CONTAINED}
                    onClick={() => dispatch(login())}
                    className={'Button'}
                />
                <Typography variant="subtitle1"
                            className={'Link'}
                            display={'inline'}>¿Olvidaste tu contraseña?</Typography>
            </div>
        </div>
    );
}