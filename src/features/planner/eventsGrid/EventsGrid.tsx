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
import {ActionsRenderer, DateRenderer, durationFormatter, HourRenderer, StatusRenderer} from './CellRenderers';
import {ConnectedStatusFilter} from './StatusFilter';
import {AG_GRID_LOCALE_ES} from './locale.es';
import {Accordion, AccordionDetails, AccordionSummary, AppBar, Tab, Tabs, Typography} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import {Tooltip} from '../../../components/tooltip/Tooltip';
import '../../../styles/common.scss';
import {DateTime} from 'luxon';

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

export function EventsGrid(props: any) {

    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const groupedEvents = useSelector(selectEvents);

    const columnDefs: Array<ColDef> = [
        {
            field: 'name',
            headerName: 'Nombre',
            lockPosition: true,
            filter: true,
            filterParams: {
                buttons: ['reset'],
            },
        },{
            field: 'status',
            headerName: 'Estado',
            cellRenderer: 'statusRenderer',
            filter: 'statusFilter',
        },{
            field: 'date',
            headerName: 'Fecha',
            cellRenderer: 'dateRenderer',
            filter: 'agDateColumnFilter',
            filterParams: {
                comparator: (filterLocalDateAtMidnight: any, cellValue: string) => {

                    if(cellValue === 'pending' || cellValue == null) {
                        return 0;
                    }

                    const date = DateTime.fromFormat(cellValue, 'yyyy M dd').toJSDate();

                    if (date < filterLocalDateAtMidnight) {
                        return -1;
                    } else if (date > filterLocalDateAtMidnight) {
                        return 1;
                    }
                    return 0;
                },
                buttons: ['reset'],
            },
        },{
            field: 'time',
            headerName: 'Hora',
            cellRenderer: 'hourRenderer',
        },{
            field: 'duration',
            headerName: 'Duración',
            valueFormatter: durationFormatter,
            filter: 'agNumberColumnFilter',
        }, {
            cellRenderer: 'actionsRenderer',
        }
    ];

    const frameworkComponents = {
        statusRenderer: StatusRenderer,
        statusFilter: ConnectedStatusFilter,
        dateRenderer: DateRenderer,
        hourRenderer: HourRenderer,
        actionsRenderer: ActionsRenderer
    }

    const defaultColDef = {
        lockVisible: true,
        sortable: true,
        flex: 1,
        resizable: true,
    };

    useSelector(selectDrawerSelector, () => false);

    useEffect((): any => {
        if(gridApi) gridApi.sizeColumnsToFit();
    })

    const statusFilterSelectedOptions = useSelector(selectSelectedOptionsStatusFilter);
    const onGridReady = (params: GridReadyEvent)=> {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
        params.api.setFilterModel({status: {filter: statusFilterSelectedOptions}})
    }

    const [value, setValue] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div className={'EventsGridContainer'}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleTabChange}>
                    {groupedEvents.map((ev, index) => {return (<Tab key={index} label={ev.groupName} />);})}
                </Tabs>
            </AppBar>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography  color={'textSecondary'} variant={'body1'} className={'Bold'}>Información de la convocatoria</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={'DateRangeContainer'}>
                            <Typography color={'primary'} display={'inline'} className={'Bold'}>Rango de fechas</Typography>
                            <Tooltip icon={<InfoIcon className={'FillPrimary InfoIcon'}/>}
                                     text={'Rango de fecha oficial en el que se celebra la convocatoria. Esta fecha está definida por la universidad.'}
                                     placement={'right'}/>
                            <div className={'DateRange'}>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}><span className={'Bold'}>Desde:</span> 10/02/2021</Typography><br/>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}><span className={'Bold'}>Hasta:</span> 10/03/2021</Typography>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Typography  color={'textSecondary'} variant={'body1'} className={'Bold GridTitle'}>Defensas programadas</Typography>
                <div className='ag-theme-material Grid'>
                    <AgGridReact
                        localeText={AG_GRID_LOCALE_ES}
                        onGridReady={(params) => onGridReady(params)}
                        rowData={groupedEvents[value].events}
                        columnDefs={columnDefs}
                        frameworkComponents={frameworkComponents}
                        defaultColDef={defaultColDef}
                        immutableData={true}
                        immutableColumns={false}
                        pagination={true}
                        getRowNodeId={(data) => data.id}
                        paginationPageSize={10}
                    >
                    </AgGridReact>
                </div>
            </div>
        </>
    );
}