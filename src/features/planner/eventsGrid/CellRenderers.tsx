import React, {Component} from 'react';
import {ICellRendererParams} from 'ag-grid-community';
import {DateTime} from 'luxon';
import {statusMapper} from './EventsGrid';

export class StatusRenderer extends Component<ICellRendererParams> {
    render() {
        return statusMapper(this.props.value).element;
    }
}

export class DateRenderer extends Component<ICellRendererParams> {
    render() {
        if(this.props.value === 'pending'){
            return <span className={'StatusPending PendingDashDate'}>-</span>;
        }
        const date = DateTime.fromFormat(this.props.value, 'yyyy M dd').toFormat('dd/MM/yyyy');
        return <span>{date}</span>;
    }
}

export class HourRenderer extends Component<ICellRendererParams> {
    render() {
        if(this.props.value === 'pending'){
            return <span className={'StatusPending PendingDashHour'}>-</span>;
        }
        return <span>{this.props.value}</span>;
    }
}

export class DurationRenderer extends Component<ICellRendererParams> {
    render() {
        return <span>{this.props.value} minutos</span>;
    }
}