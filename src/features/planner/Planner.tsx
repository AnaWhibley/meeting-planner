import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import './Planner.scss';
import Drawer from './drawer/Drawer';

export function Planner() {
    return (
        <div className={'PlannerContainer'}>
            <NavBar view={'Planner'}/>
            <Drawer/>
        </div>
    );
}