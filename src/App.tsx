import React, {useEffect, useState} from 'react';
import './App.scss';
import {Login} from './features/login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {Role} from './services/userService';
import {Dashboard} from './features/dashboard/Dashboard';
import {Profile} from './features/profile/Profile';
import {Color, theme} from './styles/theme';
import {
    CircularProgress, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ThemeProvider,
    Typography
} from '@material-ui/core';
import {ErrorPage} from './components/errorPage/errorPage';
import { EventCreator } from './features/eventCreator/EventCreator';
import './styles/common.scss';
import {Form} from './features/eventCreator/form/Form';
import {selectLoggedInUser, selectNameErrorMessage} from './app/login/selectors';
import {Planner} from './features/planner/Planner';
import {checkUserSession, editUserName, User} from './app/login/slice';
import {
    selectFirstTimeLoggingDialogOpen,
    selectIsCreatingEvents,
    selectIsLoading
} from './app/uiStateSlice';
import TextInput from './components/textInput/TextInput';
import ActionButton, {ButtonVariant} from './components/actionButton/ActionButton';

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkUserSession());
    },[]);

    const PrivateRoute = (props: {path: string, component: JSX.Element, admin?: boolean}) => {
        const loggedInUser: User = useSelector(selectLoggedInUser);
        return (
            <Route exact path={props.path}>
                {!loggedInUser ?
                    <Redirect to="/login" />
                    :
                    props.admin ?
                        loggedInUser.role === Role.ADMIN ?
                            props.component
                            :
                            <Redirect to="/errorPage" />
                        : props.component}
            </Route>
        )
    };

    const isLoading = useSelector(selectIsLoading);
    const isCreatingEvents = useSelector(selectIsCreatingEvents);

    const dialogOpen = useSelector(selectFirstTimeLoggingDialogOpen);
    const usernameError = useSelector(selectNameErrorMessage);

    const [userName, setUserName] = useState('');

    return (
        <>
            <ThemeProvider theme={theme}>
                {isLoading ?
                    <div className={'CircularProgressContainer'}>
                        <div className={'CircularProgressWrapper'}>
                            <CircularProgress className={'CircularProgress'} size={80} thickness={5}/>
                            <Typography color={'primary'} variant={'body1'}>Cargando contenido</Typography>
                        </div>
                    </div>
                    :
                    null
                }
                {isCreatingEvents ?
                    <div className={'CircularProgressContainer'}>
                        <div className={'CircularProgressWrapper'}>
                            <CircularProgress className={'CircularProgress'} size={80} thickness={5}/>
                            <Typography color={'primary'} variant={'body1'}>Creando eventos</Typography>
                        </div>
                    </div>
                    :
                    null
                }

                <Dialog
                    open={dialogOpen}>
                    <DialogTitle >{"¡Bienvenido a Meeting Planner!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Antes de comenzar, nos gustaría saber tu nombre:
                        </DialogContentText>
                        <TextInput
                            className={'InputForgotPassword'}
                            label="Nombre"
                            fullWidth={true}
                            value={userName}
                            onChange={(value: string) => setUserName(value)}
                        />
                        {usernameError ?
                            <Typography variant="subtitle1"
                                        className={"ErrorMessage ErrorMessageForgotPassword"}
                                        color={"error"}>
                                {usernameError}
                            </Typography>
                            : null}
                    </DialogContent>
                    <DialogActions>
                        <ActionButton onClick={() => dispatch(editUserName(userName))}
                                      color={Color.PRIMARY}
                                      innerText={'Confirmar'}
                                      variant={ButtonVariant.TEXT}/>
                    </DialogActions>
                </Dialog>

                <Router>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/errorPage">
                            <ErrorPage />
                        </Route>
                        <PrivateRoute path='/dashboard' component={<Dashboard/>} admin={true}/>
                        <PrivateRoute path='/createEvents/form' component={<Form/>} admin={true}/>
                        <PrivateRoute path='/createEvents' component={<EventCreator/>} admin={true}/>
                        <PrivateRoute path='/profile' component={<Profile/>} />
                        <PrivateRoute path='/' component={<Planner/>}/>
                    </Switch>
                </Router>
            </ThemeProvider>
        </>
    );

}

export default App;
