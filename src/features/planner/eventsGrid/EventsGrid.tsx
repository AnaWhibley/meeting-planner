import React, {useState} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {useSelector} from 'react-redux';
import { selectEvents } from '../../../app/planner/selectors';
import {GridReadyEvent} from 'ag-grid-community/dist/lib/events';
import {GridApi} from 'ag-grid-community/dist/lib/gridApi';
import {ColumnApi} from 'ag-grid-community/dist/lib/columnController/columnApi';

export function EventsGrid() {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const events = useSelector(selectEvents);

    const columnDefs = [
        {
            field: 'name',
            filter: true,
            sortable: true
        },{
            field: 'duration',
        },{
            field: 'id',
        },
    ];

    const onGridReady = (params: GridReadyEvent)=> {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    }

    return (
        <div className='ag-theme-material' style={{ height: 400, width: '100%' }}>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={events[0].events}
                columnDefs={columnDefs}>
            </AgGridReact>
        </div>
    );
}