import React from 'react';
import './App.css';
import {Login} from './features/login/Login';
import {useSelector} from 'react-redux';
import {selectLoggedInUser} from './app/loginSlice';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {User} from './services/userService';
import {Dashboard} from './features/dashboard/Dashboard';
import {Profile} from './features/profile/Profile';
import {EventCreator} from './features/eventCreator/EventCreator';
import { Calendar } from './features/calendar/Calendar';
import {theme} from './styles/theme';
import { ThemeProvider } from '@material-ui/core';

function App() {

    const PrivateRoute = (props: {path: string, component: JSX.Element}) => {
        const loggedInUser: User | undefined = useSelector(selectLoggedInUser);
        return (
            <Route exact path={props.path}>
                {!loggedInUser ? <Redirect to="/login" /> : props.component}
            </Route>
        )
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <PrivateRoute path='/dashboard' component={<Dashboard/>} />
                    <PrivateRoute path='/wizard' component={<EventCreator/>} />
                    <PrivateRoute path='/profile' component={<Profile/>} />
                    <PrivateRoute path='/' component={<Calendar/>}/>
                </Switch>
            </Router>
        </ThemeProvider>
    );

}

export default App;
