import React, {useEffect, useState} from 'react';
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

export function EventsGrid() {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const events = useSelector(selectEvents);

    const columnDefs: Array<ColDef> = [
        {
            field: 'name',
            headerName: 'Nombre',
            filter: true,
            sortable: true,
            lockVisible: true,
            resizable: true,
            lockPosition: true,
        },{
            field: 'status',
            headerName: 'Estado',
            lockVisible: true,
            resizable: true,
        },{
            field: 'date',
            headerName: 'Fecha',
            lockVisible: true,
            resizable: true
        },{
            field: 'time',
            headerName: 'Hora',
            lockVisible: true,
            resizable: true
        },{
            field: 'duration',
            headerName: 'Duración',
            lockVisible: true,
            resizable: true,
            sortable: true
        }
    ];

    useSelector(selectDrawerSelector, () => false);

    useEffect(() => {
        if(gridApi) gridApi.sizeColumnsToFit();
        if (gridColumnApi) gridColumnApi.autoSizeColumn('name')
    })

    const onGridReady = (params: GridReadyEvent)=> {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    return (
        <div className='ag-theme-material GridContainer'>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={events[0].events}
                columnDefs={columnDefs}>
            </AgGridReact>
        </div>
    );
}