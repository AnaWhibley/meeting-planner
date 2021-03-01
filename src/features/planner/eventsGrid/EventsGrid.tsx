import React, {Component, useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {connect, useDispatch, useSelector} from 'react-redux';
import { selectEvents } from '../../../app/planner/selectors';
import {GridReadyEvent} from 'ag-grid-community/dist/lib/events';
import {GridApi} from 'ag-grid-community/dist/lib/gridApi';
import {ColumnApi} from 'ag-grid-community/dist/lib/columnController/columnApi';
import './EventsGrid.scss';
import {ColDef} from 'ag-grid-community/dist/lib/entities/colDef';
import {
    selectDrawerSelector, selectSelectedOptionsStatusFilter,
    setSelectedOptionsStatusFilter,
} from '../../../app/uiStateSlice';
import {IFilterParams} from 'ag-grid-community';
import {ReactComponent as VerifiedIcon} from '../../../assets/icons/evericons/verified.svg';
import {ReactComponent as ErrorIcon} from '../../../assets/icons/evericons/x-octagon.svg';
import {ReactComponent as PendingIcon} from '../../../assets/icons/evericons/question-circle.svg';
import {
    Checkbox,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, ListSubheader
} from '@material-ui/core';
import {RootState} from '../../../app/store';
import {DateRenderer, DurationRenderer, HourRenderer, StatusRenderer} from './CellRenderers';
import {ConnectedStatusFilter} from './StatusFilter';
import {AG_GRID_LOCALE_ES} from './locale.es';

export const statusMapper = (status: string) => {
    if(status === 'confirmed') {
        const value = 'Confirmado';
        const style = 'StatusVerified';
        return {
            value,
            style,
            element: <span className={style}><VerifiedIcon/>{value}</span>
        };
    }else if(status === 'pending'){
        const value = 'Pendiente';
        const style = 'StatusPending';
        return {
            value,
            style,
            element: <span className={style}><PendingIcon/>{value}</span>
        };
    }else{
        const value = 'Necesita intervención';
        const style = 'StatusError';
        return {
            value,
            style,
            element: <span className={style}><ErrorIcon/>{value}</span>
        }
    }
};

export function EventsGrid() {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const events = useSelector(selectEvents);

    const columnDefs: Array<ColDef> = [
        {
            field: 'name',
            headerName: 'Nombre',
            lockPosition: true,
            filter: true,
        },{
            field: 'status',
            headerName: 'Estado',
            cellRenderer: 'statusRenderer',
            filter: 'statusFilter'
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
        statusFilter: ConnectedStatusFilter,
        dateRenderer: DateRenderer,
        hourRenderer: HourRenderer,
        durationRenderer: DurationRenderer,
    }

    const defaultColDef = {
        lockVisible: true,
        sortable: true,
        flex: 1,
        resizable: true,
    };

    useSelector(selectDrawerSelector, () => false);

    useEffect(() => {
        if(gridApi) gridApi.sizeColumnsToFit();
    })

    const statusFilterSelectedOptions = useSelector(selectSelectedOptionsStatusFilter);
    const onGridReady = (params: GridReadyEvent)=> {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
        params.api.setFilterModel({status: {filter: statusFilterSelectedOptions}})
    }

    return (
        <div className='ag-theme-material GridContainer'>
            <AgGridReact
                localeText={AG_GRID_LOCALE_ES}
                onGridReady={onGridReady}
                rowData={events[0].events}
                columnDefs={columnDefs}
                frameworkComponents={frameworkComponents}
                defaultColDef={defaultColDef}
                immutableData={true}
                immutableColumns={false}
                pagination={true}
                paginationPageSize={10}
            >
            </AgGridReact>
        </div>
    );
}
