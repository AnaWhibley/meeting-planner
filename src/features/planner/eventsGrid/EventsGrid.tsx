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
import {ColDef, ValueFormatterParams} from 'ag-grid-community/dist/lib/entities/colDef';
import {
    selectDrawerSelector, selectSelectedOptionsStatusFilter,
} from '../../../app/uiStateSlice';
import {ReactComponent as VerifiedIcon} from '../../../assets/icons/evericons/verified.svg';
import {ReactComponent as ErrorIcon} from '../../../assets/icons/evericons/x-octagon.svg';
import {ReactComponent as PendingIcon} from '../../../assets/icons/evericons/question-circle.svg';
import {DateRenderer, HourRenderer, StatusRenderer} from './CellRenderers';
import {ConnectedStatusFilter} from './StatusFilter';
import {AG_GRID_LOCALE_ES} from './locale.es';
import {GroupedEventDto} from '../../../services/eventService';
import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';

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
const durationFormatter = (params: ValueFormatterParams) => {
    return params.value + ' minutos';
};

export function EventsGrid() {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const groupedEvents = useSelector(selectEvents);

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
            valueFormatter: durationFormatter,
            filter: 'agNumberColumnFilter'
        }
    ];

    const frameworkComponents = {
        statusRenderer: StatusRenderer,
        statusFilter: ConnectedStatusFilter,
        dateRenderer: DateRenderer,
        hourRenderer: HourRenderer,
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

    const eventsView = groupedEvents.map((event: GroupedEventDto) => {
        return (
            <div className={'EventsGridContainer'} key={event.groupName}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography>{event.groupName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                            >
                                <Typography>Información convocatoria</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                Desde {event.from} hasta {event.to}
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Typography>Defensas programadas</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='ag-theme-material Grid'>
                                    <AgGridReact
                                        localeText={AG_GRID_LOCALE_ES}
                                        onGridReady={onGridReady}
                                        rowData={event.events}
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
                            </AccordionDetails>
                        </Accordion>
                    </AccordionDetails>
                </Accordion>
            </div>
        )
    });

    return (
        <>
            {eventsView}
        </>
    );
}
