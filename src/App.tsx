import React from 'react';
import './App.css';
import {Login} from './features/login/Login';
import {useSelector} from 'react-redux';
import {selectLoggedInUser} from './app/loginSlice';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {Role, User} from './services/userService';
import {Dashboard} from './features/dashboard/Dashboard';
import {Profile} from './features/profile/Profile';
import {EventCreator} from './features/eventCreator/EventCreator';
import {Calendar} from './features/calendar/Calendar';
import {theme} from './styles/theme';
import {ThemeProvider} from '@material-ui/core';
import {ErrorPage} from './components/errorPage/errorPage';

function App() {

    const PrivateRoute = (props: {path: string, component: JSX.Element, admin?: boolean}) => {
        const loggedInUser: User | undefined = useSelector(selectLoggedInUser);
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

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/errorPage">
                        <ErrorPage />
                    </Route>
                    <PrivateRoute path='/dashboard' component={<Dashboard/>} admin={true}/>
                    <PrivateRoute path='/wizard' component={<EventCreator/>} admin={true}/>
                    <PrivateRoute path='/profile' component={<Profile/>} />
                    <PrivateRoute path='/' component={<Calendar/>}/>
                </Switch>
            </Router>
        </ThemeProvider>
    );

}

export default App;
