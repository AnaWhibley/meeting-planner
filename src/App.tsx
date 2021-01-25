import React from 'react';
import './App.css';
import {Login} from "./features/login/login";
import {useSelector} from "react-redux";
import {selectLoggedInUser} from "./features/login/loginSlice";
import {BrowserRouter as Router, Redirect, Route, Switch, Link} from "react-router-dom";
import {User} from "./services/userService";

const Dashboard = () => <h3>Dashboard</h3>
const Wizard = () => <h3>Wizard</h3>
const Profile = () => <h3>Profile</h3>
const Calendar = () => <h3>Calendar <Link to="/profile">Profile</Link></h3>

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
        <Router>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <PrivateRoute path='/dashboard' component={<Dashboard/>} />
                <PrivateRoute path='/wizard' component={<Wizard/>} />
                <PrivateRoute path='/profile' component={<Profile/>} />
                <PrivateRoute path='/' component={<Calendar/>}/>

            </Switch>
        </Router>
    );

}

export default App;
