import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import { ViewSelector } from './viewSelector/ViewSelector';
import './Planner.scss';

export function Planner() {
    return (
        <div className={'PlannerContainer'}>
            <NavBar view={'Planner'}/>
            <ViewSelector/>
        </div>
    );
}