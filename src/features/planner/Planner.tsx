import React from 'react';
import {NavBar} from '../../components/navigationBar/NavBar';
import {Calendar} from './calendar/Calendar';
import { ViewSelector } from './viewSelector/ViewSelector';
import './Planner.scss';

export function Planner() {
    return (
        <>
            <NavBar/>
            <div className={'PlannerContainer'}>
                <div className={'ViewSelectorContainer'}>
                    <ViewSelector/>
                </div>
                <div className={'CalendarContainer'}>
                    <Calendar/>
                </div>
            </div>
        </>
    );
}