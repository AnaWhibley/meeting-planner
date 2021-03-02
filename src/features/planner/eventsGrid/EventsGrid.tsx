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
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import {Tooltip} from '../../../components/tooltip/Tooltip';
import '../../../styles/common.scss';

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

let gridApi: Array<GridApi> = [];

export function EventsGrid() {
    // const [gridApi, setGridApi] = useState<Array<GridApi>>([]);
    const [gridColumnApi, setGridColumnApi] = useState<Array<ColumnApi>>([]);

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

    useEffect((): any => {
        console.log('!!! ', gridApi)
        if(gridApi.length > 0) gridApi.forEach(api => {
            api.sizeColumnsToFit();
            console.log('hola');
        });
        return () => gridApi = [];
    })

    const statusFilterSelectedOptions = useSelector(selectSelectedOptionsStatusFilter);
    const onGridReady = (params: GridReadyEvent, index: number)=> {
        console.log(params.api, index)
        /*        const newGridApi = gridApi.slice();
                newGridApi.push(params.api);
                setGridApi(newGridApi);*/
        gridApi.push(params.api);

        console.log('!!!2 ', gridApi)

        const newGridColumnApi = [...gridColumnApi];
        newGridColumnApi[index] = params.columnApi;
        setGridColumnApi(newGridColumnApi);

        params.api.sizeColumnsToFit();
        params.api.setFilterModel({status: {filter: statusFilterSelectedOptions}})
    }

    const eventsView = groupedEvents.map((event: GroupedEventDto, index: number) => {
        return (
            <div className={'EventsGridContainer'} key={event.groupName}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography variant={'h2'} color={'primary'}>{event.groupName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                            >
                                <Typography  color={'secondary'} variant={'body1'} className={'Bold'}>Información de la convocatoria</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={'DateRangeContainer'}>
                                    <Typography color={'textSecondary'} variant={'body1'} display={'inline'} className={'Bold'}>Rango de fechas</Typography>
                                    <Tooltip icon={<InfoIcon className={'FillTextSecondary InfoIcon'}/>}
                                             text={'Rango de fecha oficial en el que se celebra la convocatoria. Esta fecha está definida por la universidad.'}
                                             placement={'right'}/>
                                    <div className={'DateRange'}>
                                        <Typography color={'textSecondary'} variant={'body1'} display={'inline'}><span className={'Bold'}>Desde:</span> 10/02/2021</Typography><br/>
                                        <Typography color={'textSecondary'} variant={'body1'} display={'inline'}><span className={'Bold'}>Hasta:</span> 10/03/2021</Typography>
                                    </div>
                                </div>

                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Typography  color={'secondary'} variant={'body1'} className={'Bold'}>Defensas programadas</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='ag-theme-material Grid'>
                                    <AgGridReact
                                        localeText={AG_GRID_LOCALE_ES}
                                        onGridReady={(params) => onGridReady(params, index)}
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
