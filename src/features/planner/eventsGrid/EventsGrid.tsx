import React, {Component, FunctionComponent, useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {useSelector} from 'react-redux';
import { selectEvents } from '../../../app/planner/selectors';
import {GridReadyEvent} from 'ag-grid-community/dist/lib/events';
import {GridApi} from 'ag-grid-community/dist/lib/gridApi';
import {ColumnApi} from 'ag-grid-community/dist/lib/columnController/columnApi';
import './EventsGrid.scss';
import {ColDef} from 'ag-grid-community/dist/lib/entities/colDef';
import {selectDrawerSelector} from '../../../app/uiStateSlice';
import {ICellRendererParams} from 'ag-grid-community';
import {ReactComponent as VerifiedIcon} from '../../../assets/icons/evericons/verified.svg';
import {ReactComponent as ErrorIcon} from '../../../assets/icons/evericons/x-octagon.svg';
import {ReactComponent as PendingIcon} from '../../../assets/icons/evericons/question-circle.svg';
import {DateTime} from 'luxon';

export function EventsGrid() {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const events = useSelector(selectEvents);

    const columnDefs: Array<ColDef> = [
        {
            field: 'name',
            headerName: 'Nombre',
            lockPosition: true,
        },{
            field: 'status',
            headerName: 'Estado',
            cellRenderer: 'statusRenderer'
        },{
            field: 'date',
            headerName: 'Fecha',
            cellRenderer: 'dateRenderer'
        },{
            field: 'time',
            headerName: 'Hora',
            lockVisible: true,
            cellRenderer: 'hourRenderer'
        },{
            field: 'duration',
            headerName: 'Duración',
            lockVisible: true,
            cellRenderer: 'durationRenderer'
        }
    ];

    const frameworkComponents = {
        statusRenderer: StatusRenderer,
        dateRenderer: DateRenderer,
        hourRenderer: HourRenderer,
        durationRenderer: DurationRenderer
    }

    const defaultColDef = {
        lockVisible: true,
        sortable: true,
        flex: 1,
        filter: true,
        resizable: true,
    };

    useSelector(selectDrawerSelector, () => false);

    useEffect(() => {
        if(gridApi) gridApi.sizeColumnsToFit();
        //if (gridColumnApi) gridColumnApi.autoSizeColumn('name')
    })

    const onGridReady = (params: GridReadyEvent)=> {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
        //params.columnApi.autoSizeColumn('name');
    }

    return (
        <div className='ag-theme-material GridContainer'>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={events[0].events}
                columnDefs={columnDefs}
                frameworkComponents={frameworkComponents}
                defaultColDef={defaultColDef}
                immutableData={true}
            >
            </AgGridReact>
        </div>
    );
}

const StatusIcon: FunctionComponent = function (props): JSX.Element {
    if(props.children === 'confirmed') {
        return <span className={'StatusVerified'}><VerifiedIcon/>Confirmado</span>
    }else if(props.children === 'pending'){
        return <span className={'StatusPending'}><PendingIcon/>Pendiente</span>
    }else{
        return <span className={'StatusError'}><ErrorIcon/>Necesita intervención</span>
    }
};

class StatusRenderer extends Component<ICellRendererParams> {
    render() {
        return <StatusIcon>{this.props.value}</StatusIcon>;
    }
}

class DateRenderer extends Component<ICellRendererParams> {
    render() {
        if(this.props.value === 'pending'){
            return <span className={'StatusPending PendingDashDate'}>-</span>;
        }
        const date = DateTime.fromFormat(this.props.value, 'yyyy M dd').toFormat('dd/MM/yyyy');
        return <span>{date}</span>;
    }
}

class HourRenderer extends Component<ICellRendererParams> {
    render() {
        if(this.props.value === 'pending'){
            return <span className={'StatusPending PendingDashHour'}>-</span>;
        }
        return <span>{this.props.value}</span>;
    }
}

class DurationRenderer extends Component<ICellRendererParams> {
    render() {
        return <span>{this.props.value} minutos</span>;
    }
}