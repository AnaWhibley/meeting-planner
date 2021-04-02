import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {useDispatch, useSelector} from 'react-redux';
import { selectEvents } from '../../../app/planner/selectors';
import {GridReadyEvent, RowClickedEvent} from 'ag-grid-community/dist/lib/events';
import {GridApi} from 'ag-grid-community/dist/lib/gridApi';
import {ColumnApi} from 'ag-grid-community/dist/lib/columnController/columnApi';
import './EventsGrid.scss';
import '../../../styles/common.scss';
import {ColDef} from 'ag-grid-community/dist/lib/entities/colDef';
import {
    selectDeleteEventCompleted, selectDeleteGroupedEventCompleted,
    selectDrawerSelector,
    selectEventsGridSelectedTab,
    selectSelectedOptionsStatusFilter,
    selectSelectedRowInformation,
    setDeleteEventCompleted,
    setDeleteGroupedEventCompleted,
    setEventsGridSelectedTab,
    setSelectedRowInformation,
} from '../../../app/uiStateSlice';
import {ReactComponent as XIcon} from '../../../assets/icons/evericons/x.svg';
import {ReactComponent as VerifiedIcon} from '../../../assets/icons/evericons/verified.svg';
import {ReactComponent as ErrorIcon} from '../../../assets/icons/evericons/x-octagon.svg';
import {ReactComponent as PendingIcon} from '../../../assets/icons/evericons/question-circle.svg';
import {
    ActionsRenderer,
    ColorRenderer,
    DateRenderer,
    durationFormatter,
    HourRenderer,
    StatusRenderer
} from './CellRenderers';
import {ConnectedStatusFilter} from './StatusFilter';
import {AG_GRID_LOCALE_ES} from './locale.es';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    AppBar, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Snackbar,
    Tab,
    Tabs,
    Typography
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import {Tooltip} from '../../../components/tooltip/Tooltip';
import '../../../styles/common.scss';
import {DateTime} from 'luxon';
import { ParticipantInfo } from '../../../components/participantInformation/ParticipantInfo';
import {ParticipantDto} from '../../../services/eventService';
import {DATE_FORMAT} from '../../../app/eventCreator/slice';
import {ReactComponent as TrashIcon} from "../../../assets/icons/evericons/trash-empty.svg";
import {selectLoggedInUser} from "../../../app/login/selectors";
import {Role} from "../../../services/userService";
import {deleteEvent, deleteGroupedEvent} from '../../../app/planner/slice';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {Alert} from '../../../components/alert/Alert';

export const statusMapper = (status: string) => {
    if(status === 'confirmed') {
        const value = 'Confirmado';
        const style = 'StatusVerified';
        const icon = <VerifiedIcon/>;
        return {
            value,
            style,
            icon,
            element: <span className={style}>{icon}{value}</span>
        };
    }else if(status === 'pending'){
        const value = 'Pendiente';
        const style = 'StatusPending';
        const icon = <PendingIcon/>;
        return {
            value,
            style,
            icon,
            element: <span className={style}>{icon}{value}</span>
        };
    }else{
        const value = 'Necesita intervención';
        const style = 'StatusError';
        const icon = <ErrorIcon/>;
        return {
            value,
            style,
            icon,
            element: <span className={style}>{icon}{value}</span>
        }
    }
};

export const DialogDelete = (props: {title: string, handleAcceptDialog: () => void, handleCloseDialog: () => void, openDialog: boolean}) => (
    <Dialog open={props.openDialog} onClose={props.handleCloseDialog}>
        <DialogTitle className={'Error'}>{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText className={'Center'}>
                Por favor, ten en cuenta que <u>esta acción no se puede deshacer.</u>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <ActionButton onClick={props.handleCloseDialog} color={Color.PRIMARY} innerText={'Cancelar'} variant={ButtonVariant.TEXT} className={'FillTextSecondary'}/>
            <ActionButton onClick={props.handleAcceptDialog} color={Color.PRIMARY} innerText={'Eliminar'}
                          className={'Error'}
                          icon={<TrashIcon className={'Error SvgDialogDeleteGroup'}/>}
                          variant={ButtonVariant.TEXT} autoFocus={true}/>
        </DialogActions>
    </Dialog>);

export function EventsGrid() {

    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);

    const groupedEvents = useSelector(selectEvents);

    const columnDefs: Array<ColDef> = [
        {
            cellRenderer: 'colorRenderer',
            headerName: '',
            field: 'color',
            lockPosition: true,
            width: 20
        }, {
            field: 'name',
            headerName: 'Nombre',
            lockPosition: true,
            filter: true,
            filterParams: {
                buttons: ['reset'],
            },
            minWidth: 250
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

                    const date = DateTime.fromFormat(cellValue, DATE_FORMAT).toJSDate();

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
            minWidth: 220,
            sortable: false,
            cellRendererParams: {
                onDeleteEvent: () => setOpenDialogDeleteEvent(true)
            }
        }
    ];

    const frameworkComponents = {
        colorRenderer: ColorRenderer,
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

    const currentTab = useSelector(selectEventsGridSelectedTab);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        dispatch(setEventsGridSelectedTab(newValue));
        dispatch(setSelectedRowInformation(undefined));
    };

    const dispatch = useDispatch();
    const selectedRow = useSelector(selectSelectedRowInformation);

    const onRowClicked = (event: RowClickedEvent) => {
        dispatch(setSelectedRowInformation({eventId: event.data.id, groupId: currentTab}));
    }

    const loggedInUser = useSelector(selectLoggedInUser);

    const [openDialogDeleteGroupedEvent, setOpenDialogDeleteGroupedEvent] = React.useState(false);
    const [openDialogDeleteEvent, setOpenDialogDeleteEvent] = React.useState(false);

    const acceptDeleteGroupedEvent = () => {
        dispatch(deleteGroupedEvent(groupedEvents[currentTab].groupName));
    }

    const acceptDeleteEvent = () => {
        if (selectedRow) {
            dispatch(deleteEvent(groupedEvents[currentTab].groupName, selectedRow.id));
        }
    }

    const deleteGroupedEventCompleted = useSelector(selectDeleteGroupedEventCompleted);
    const deleteEventCompleted = useSelector(selectDeleteEventCompleted);

    return (
        <>
            {groupedEvents.length > 0 ? <div className={'EventsGridContainer'}>
                <AppBar position="static">
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        {groupedEvents.map((ev, index) => {return (<Tab key={index} label={ev.groupName} />);})}
                    </Tabs>
                </AppBar>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography  color={'textSecondary'} variant={'body1'} className={'Bold'}>Información de la convocatoria</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={'AccordionDetailsGroupedEvent'}>
                        <div className={'Dates'}>
                            <div className={'DateRangeContainer'}>
                                <Tooltip icon={<InfoIcon className={'FillPrimary'}/>}
                                         text={'Rango oficial en el que se celebra la convocatoria. Esta fecha está definida por la universidad.'}
                                         placement={'bottom'}/>
                                <Typography color={'primary'}  display={'inline'} variant={'body1'} className={'Bold'}>Rango de convocatoria: </Typography>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}> {groupedEvents[currentTab].from} - </Typography>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}>{groupedEvents[currentTab].to}</Typography>
                            </div>
                            <div className={'DateRangeContainer'}>
                                <Tooltip icon={<InfoIcon className={'FillPrimary'}/>}
                                         text={'Rango de fecha para confirmar asistencia a las defensas e introducir últimas indisponibilidades si fuera necesario.'}
                                         placement={'bottom'}/>
                                <Typography color={'primary'}  display={'inline'} variant={'body1'} className={'Bold'}>Rango de confirmación: </Typography>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}> {groupedEvents[currentTab].from} - </Typography>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}>{groupedEvents[currentTab].to}</Typography>
                            </div>
                            <div className={'DateRangeContainer'}>
                                <Tooltip icon={<InfoIcon className={'FillPrimary'}/>}
                                         text={'Fecha a partir de la cual todos los eventos de la convocatoria quedan confirmados.'}
                                         placement={'bottom'}/>
                                <Typography color={'primary'}  display={'inline'} variant={'body1'} className={'Bold'}>Confirmación de fechas: </Typography>
                                <Typography color={'textSecondary'} variant={'body1'} display={'inline'}> {groupedEvents[currentTab].from}</Typography>
                            </div>
                        </div>
                        {loggedInUser && loggedInUser.role === Role.ADMIN ?
                            <div className={'Actions'}>
                                <Typography color={'secondary'} align={'center'} variant={'body1'} className={'Bold'}>Acciones</Typography>
                                {/*<div className={'OptionsIconContainer'}>
                                    <Tooltip icon={<OptionsIcon/>}
                                             text={'Editar'}
                                             placement={'bottom'}/>
                                </div>*/}
                                <div className={'TrashIconContainer'}>
                                    <Tooltip icon={<TrashIcon/>}
                                             text={'Eliminar'}
                                             onClick={() => setOpenDialogDeleteGroupedEvent(true)}
                                             placement={'bottom'}/>
                                </div>
                            </div>
                            : null}
                    </AccordionDetails>
                </Accordion>
                <DialogDelete title={'¿Estás seguro que quieres eliminar esta convocatoria?'}
                              handleAcceptDialog={acceptDeleteGroupedEvent}
                              handleCloseDialog={() => setOpenDialogDeleteGroupedEvent(false)}
                              openDialog={openDialogDeleteGroupedEvent}
                />
                <DialogDelete title={'¿Estás seguro que quieres eliminar este evento?'}
                              handleAcceptDialog={acceptDeleteEvent}
                              handleCloseDialog={() => setOpenDialogDeleteEvent(false)}
                              openDialog={openDialogDeleteEvent}
                />
                <Snackbar open={deleteGroupedEventCompleted} autoHideDuration={3000} onClose={() => dispatch(setDeleteGroupedEventCompleted(false))}>
                    <Alert severity="success" onClose={() => dispatch(setDeleteGroupedEventCompleted(false))}>
                        ¡Se ha eliminado la convocatoria exitosamente!
                    </Alert>
                </Snackbar>
                <Snackbar open={deleteEventCompleted} autoHideDuration={3000} onClose={() => dispatch(setDeleteEventCompleted(false))}>
                    <Alert severity="success" onClose={() => dispatch(setDeleteEventCompleted(false))}>
                        ¡Se ha eliminado el evento exitosamente!
                    </Alert>
                </Snackbar>
                <Typography  color={'textSecondary'} variant={'body1'} className={'Bold GridTitle'}>Defensas programadas</Typography>
                <div className='ag-theme-material Grid'>
                    <AgGridReact
                        domLayout='autoHeight'
                        localeText={AG_GRID_LOCALE_ES}
                        onGridReady={(params) => onGridReady(params)}
                        rowData={groupedEvents[currentTab].events}
                        columnDefs={columnDefs}
                        frameworkComponents={frameworkComponents}
                        defaultColDef={defaultColDef}
                        immutableData={true}
                        immutableColumns={false}
                        pagination={true}
                        getRowNodeId={(data) => data.id}
                        paginationPageSize={5}
                        rowSelection={'single'}
                        onRowClicked={(event) => onRowClicked(event)}
                    >
                    </AgGridReact>
                </div>
                {selectedRow && !openDialogDeleteEvent &&
                <div className={'SelectedRowContainer'}>
                    <div className={'Title'}>
                        <Typography color={'textSecondary'} variant={'body1'} className={'Bold'}>Información de la defensa</Typography>
                        <Tooltip icon={<XIcon className={'FillTextSecondary'}/>} text={''} onClick={() => dispatch(setSelectedRowInformation(undefined))}/>
                    </div>
                    <br/>
                    <Typography  color={'primary'} variant={'body1'} className={'Bold'}>{selectedRow.name}</Typography><br/>
                    <Typography  color={'textSecondary'} variant={'body2'} className={'Bold'}>Participantes</Typography><br/>
                    <Typography  color={'textSecondary'} variant={'subtitle2'} className={'GroupTitle'}>Tribunal Titular</Typography>
                    <div className={'ParticipantList'}>
                        {selectedRow.participants.slice(0,3).map((participant: ParticipantDto) => {
                            return (
                                <div className={'Participant'} key={participant.email}>
                                    <ParticipantInfo participant={participant}/>
                                </div>
                            )
                        })}
                    </div><br/>
                    <Typography color={'textSecondary'} variant={'subtitle2'} className={'GroupTitle'}>Tribunal Suplente</Typography>
                    <div className={'ParticipantList'}>
                        {selectedRow.participants.slice(3,6).map((participant: ParticipantDto) => {
                            return (
                                <div className={'Participant'} key={participant.email}>
                                    <ParticipantInfo participant={participant}/>
                                </div>
                            )
                        })}
                    </div><br/>
                    <Typography color={'textSecondary'} variant={'subtitle2'} className={'GroupTitle'}>Tutor/es</Typography>
                    <div className={'ParticipantList'}>
                        {selectedRow.participants.slice(6).map((participant: ParticipantDto) => {
                            return (
                                <div className={'Participant'} key={participant.email}>
                                    <ParticipantInfo participant={participant}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
                }
            </div> : <div>No hay eventos para mostrar</div>}
        </>
    );
}
