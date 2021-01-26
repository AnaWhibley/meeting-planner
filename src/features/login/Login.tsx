import React from 'react';
import {
    login,
    selectLoggedInUser,
    selectPassword,
    selectShowErrorMessage,
    selectUsername,
    setPassword,
    setUsername
} from './loginSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {Redirect} from 'react-router-dom';
import {Role, User} from '../../services/userService';

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
            <input
                aria-label="Nombre de usuario"
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => dispatch(setUsername(e.target.value))}
            />
            <input
                aria-label="Contraseña"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={e => dispatch(setPassword(e.target.value))}
            />
            <button
                aria-label="Login"
                onClick={() => dispatch(login())}
            >
                Entrar
            </button>
        </div>
    );
}