import React from 'react';
import {
    setUsername,
    setPassword,
    login,
    selectUsername,
    selectPassword, selectShowErrorMessage
} from "./loginSlice";
import {useDispatch, useSelector} from "react-redux";

export function Login() {

    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    const password = useSelector(selectPassword);
    const showErrorMessage = useSelector(selectShowErrorMessage);

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