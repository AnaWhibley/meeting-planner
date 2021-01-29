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
import {Color} from '../../styles/theme';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import './Login.scss';
import logo from '../../assets/images/logo.svg';
import {Typography} from '@material-ui/core';
import {ReactComponent as AtSignIcon} from '../../assets/icons/evericons/at-sign.svg';
import {ReactComponent as KeyIcon} from '../../assets/icons/evericons/key.svg';
import '../../styles/common.scss';

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
        <div className={'GeneralContainer'}>
            <div className={'LoginFormContainer'}>
                <div className={'LoginForm'}>
                    <img src={logo}
                         className={'LoginLogo'}
                         alt="Logo MeetingPlanner"/>
                    <TextInput
                        label="Nombre de usuario"
                        fullWidth={true}
                        value={username}
                        icon={<AtSignIcon/>}
                        onChange={(value: string) => dispatch(setUsername(value))}
                        containerClassName={'LoginInputContainer'}
                    />
                    <TextInput
                        label="Contraseña"
                        fullWidth={true}
                        type="password"
                        icon={<KeyIcon/>}
                        value={password}
                        onChange={value => dispatch(setPassword(value))}
                        containerClassName={'LoginInputContainer'}
                    />
                    { showErrorMessage ?
                        <Typography variant="subtitle1"
                                    display="inline"
                                    className={"LoginError"}
                                    color={"error"}>Nombre de usuario o contraseña incorrecto.</Typography>
                        : null
                    }
                    <ActionButton
                        innerText={'Entrar'}
                        color={Color.PRIMARY}
                        variant={ButtonVariant.CONTAINED}
                        onClick={() => dispatch(login())}
                        className={'LoginButton'}
                    />
                    <Typography variant="subtitle1"
                                className={'LoginLink'}
                                display={'inline'}>¿Olvidaste tu contraseña?</Typography>
                </div>
            </div>
        </div>
    );
}