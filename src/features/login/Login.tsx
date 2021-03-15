import React, {useState} from 'react';
import {login, setEmail, setPassword, User} from '../../app/login/slice';
import {useDispatch, useSelector} from 'react-redux';
import {Dispatch} from '@reduxjs/toolkit';
import {Redirect} from 'react-router-dom';
import {Role} from '../../services/userService';
import TextInput from '../../components/textInput/TextInput';
import {Color} from '../../styles/theme';
import ActionButton, {ButtonVariant} from '../../components/actionButton/ActionButton';
import './Login.scss';
import logo from '../../assets/images/logo.svg';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Typography
} from '@material-ui/core';
import {ReactComponent as AtSignIcon} from '../../assets/icons/evericons/at-sign.svg';
import {ReactComponent as KeyIcon} from '../../assets/icons/evericons/key.svg';
import '../../styles/common.scss';
import {selectEmail, selectErrorMessage, selectLoggedInUser, selectPassword} from '../../app/login/selectors';
import {
    forgotPassword, selectForgotPasswordDialogInfo,
    setForgotPasswordDialogProperty,
} from '../../app/uiStateSlice';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export function Login() {

    const dispatch: Dispatch<any> = useDispatch();
    const email = useSelector(selectEmail);
    const password = useSelector(selectPassword);
    const errorMessage = useSelector(selectErrorMessage);
    const loggedInUser: User | undefined = useSelector(selectLoggedInUser);
    const forgotPasswordError = useSelector(selectForgotPasswordDialogInfo).inputErrorMessage;
    const forgotPasswordEmailSent = useSelector(selectForgotPasswordDialogInfo).emailSent;
    const forgotPasswordDialog = useSelector(selectForgotPasswordDialogInfo).show;
    const forgotPasswordEmailSentError = useSelector(selectForgotPasswordDialogInfo).emailSentError;

    const handleClickForgotPasswordDialog = () => {
        dispatch(setForgotPasswordDialogProperty({show: true}));
    };

    const handleCloseForgotPasswordDialog = () => {
        dispatch(setForgotPasswordDialogProperty({show: false}));
    };

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
                    label="Email"
                    fullWidth={true}
                    value={email}
                    icon={<AtSignIcon/>}
                    onChange={(value: string) => dispatch(setEmail(value))}
                    containerClassName={'InputContainer'}
                    onEnterPress={() => dispatch(login())}
                />
                <TextInput
                    label="Contraseña"
                    fullWidth={true}
                    type="password"
                    icon={<KeyIcon/>}
                    value={password}
                    onChange={value => dispatch(setPassword(value))}
                    containerClassName={'InputContainer'}
                    onEnterPress={() => dispatch(login())}
                />
                { errorMessage.show ?
                    <Typography variant="subtitle1"
                                display="inline"
                                className={"ErrorMessage"}
                                color={"error"}>
                        {errorMessage.error}
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
                            onClick={handleClickForgotPasswordDialog}
                            display={'inline'}>¿Olvidaste tu contraseña?
                </Typography>
            </div>

            <Dialog
                open={forgotPasswordDialog}
                onClose={handleCloseForgotPasswordDialog}>
                <DialogTitle >{"¿Necesitas recordar tu contraseña?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Introduce tu correo electrónico y te enviaremos un mail para poder re-establecerla:
                    </DialogContentText>
                        <TextInput
                            className={'InputForgotPassword'}
                            label="Email"
                            fullWidth={true}
                            value={email}
                            onChange={(value: string) => dispatch(setEmail(value))}
                        />
                        { forgotPasswordError ?
                            <Typography variant="subtitle1"
                                        className={"ErrorMessage ErrorMessageForgotPassword"}
                                        color={"error"}>
                                {forgotPasswordError}
                            </Typography>
                            : null}
                </DialogContent>
                <DialogActions>
                    <ActionButton onClick={handleCloseForgotPasswordDialog} color={Color.PRIMARY} innerText={'Cancelar'} variant={ButtonVariant.TEXT}/>
                    <ActionButton onClick={() => dispatch(forgotPassword())} color={Color.PRIMARY} innerText={'Recordar contraseña'} variant={ButtonVariant.TEXT}/>
                </DialogActions>
            </Dialog>

            <Snackbar open={forgotPasswordEmailSent} autoHideDuration={2000} onClose={() => dispatch(setForgotPasswordDialogProperty({emailSent: false}))}>
                <Alert severity="success" onClose={() => dispatch(setForgotPasswordDialogProperty({emailSent: false}))}>
                    ¡Se ha enviado el email! Por favor, revisa tu correo.
                </Alert>
            </Snackbar>

            <Snackbar open={forgotPasswordEmailSentError} autoHideDuration={2000} onClose={() => dispatch(setForgotPasswordDialogProperty({emailSentError: false}))}>
                <Alert severity="error" onClose={() => dispatch(setForgotPasswordDialogProperty({emailSentError: false}))}>
                    Ha ocurrido un error al enviar el correo. Por favor, inténtelo más tarde.
                </Alert>
            </Snackbar>
        </div>
    );
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}