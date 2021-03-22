import React, {useRef} from 'react';
import FullCalendar, {DateSelectArg, EventApi, EventContentArg} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import luxonPlugin, {toLuxonDateTime} from '@fullcalendar/luxon';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.scss';
import {useDispatch, useSelector} from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
    selectBusyDatesCurrentUser,
    selectBusyDatesOtherUsers,
    selectEventsFiltered
} from '../../../app/planner/selectors';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar} from '@material-ui/core';
import '../../../styles/common.scss'
import {DATE_TIME_FORMAT, TIME_FORMAT} from '../../../app/eventCreator/slice';
import {addBusy} from '../../../app/planner/slice';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {EventContent} from './EventContent';
import {
    selectCalendarView,
    selectCurrentViewPlanner,
    ViewPlanner
} from '../../../app/uiStateSlice';
import {selectLoggedInUser} from '../../../app/login/selectors';
import {Role} from '../../../services/userService';
import {Alert} from '../../../components/alert/Alert';
import {BusyDateContent} from './BusyDateContent';
import {ReactComponent as WarningIcon} from '../../../assets/icons/evericons/alert-triangle.svg';

export function Calendar() {

    const dispatch = useDispatch();

    const busyDatesCU: any = useSelector(selectBusyDatesCurrentUser);
    const busyDatesOU: any = useSelector(selectBusyDatesOtherUsers);
    const busyDates = [...busyDatesCU, ...busyDatesOU];

    const events = useSelector(selectEventsFiltered);

    const currentUser = useSelector(selectLoggedInUser);

    const calendarRef: React.RefObject<any> = useRef();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectInfo, setSelectInfo] = React.useState<DateSelectArg>();
    const [eventOverlaps, setEventOverlaps] = React.useState(false);

    const [openSnackbarAdmin, setOpenSnackbarAdmin] = React.useState(false);
    const [openSnackbarCreateBusyDates, setOpenSnackbarCreateBusyDates] = React.useState(false);
    const [openSnackbarHasBusyDate, setOpenSnackbarHasBusyDate] = React.useState(false);

    const handleOpenDialog = (event: DateSelectArg) => {
        setOpenDialog(true);
        setSelectInfo(event);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEventOverlaps(false);
    };

    const calendarView = useSelector(selectCalendarView);
    const currentViewPlanner = useSelector(selectCurrentViewPlanner)

    const handleAcceptDialog = () => {
        if(selectInfo) {
            dispatch(addBusy(
                {
                    start: toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                    end: toLuxonDateTime(selectInfo.end, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                    allDay: selectInfo.allDay,
                    id: uuidv4()
                })
            );
            handleCloseDialog();
        }
    };

    return (
        <>
            <FullCalendar
                ref={calendarRef}
                plugins={[ dayGridPlugin, interactionPlugin, luxonPlugin, timeGridPlugin ]}
                headerToolbar={{
                    start: 'prev,next today',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                views={{
                    dayGridMonth: {
                        titleFormat: 'LLLL yyyy'
                    },
                    timeGridWeek: {
                        titleFormat: 'd LLLL',
                    },
                    timeGridDay: {
                        titleFormat: 'd LLLL yyyy',
                    }
                }}
                timeZone={'UTC'}
                initialView={calendarView}
                weekends={false}
                selectable={true}
                selectMirror={currentUser?.role !== Role.ADMIN}
                locale={esLocale}
                height={'auto'}
                slotMinTime={'08:00:00'}
                slotMaxTime={'20:00:00'}
                events={currentViewPlanner === ViewPlanner.BUSY_DATES ? busyDates : events}
                select={currentUser?.role !== Role.ADMIN ?
                    currentViewPlanner === ViewPlanner.BUSY_DATES ?
                        (event: DateSelectArg) => handleOpenDialog(event) :
                        () => setOpenSnackbarCreateBusyDates(true)
                    : () => setOpenSnackbarAdmin(true)}
                eventContent={currentViewPlanner === ViewPlanner.BUSY_DATES ? (props: EventContentArg) => <BusyDateContent {...props}/> : (props: EventContentArg) => <EventContent {...props}/>}
                selectOverlap={(event: EventApi) => {
                    const hasBusyDateAlready = event.groupId === 'currentUser';
                    // to-do -> Check if the selection overlaps confirmed events

                    const eventOverlap = event._def.extendedProps.eventId || !hasBusyDateAlready;

                    if(eventOverlap) setEventOverlaps(true);
                    if(hasBusyDateAlready && !eventOverlap) setOpenSnackbarHasBusyDate(true);

                    return eventOverlap;
                } }
            />

            <Snackbar open={openSnackbarAdmin} autoHideDuration={6000} onClose={() => setOpenSnackbarAdmin(false)}>
                <Alert severity="error" onClose={() => setOpenSnackbarAdmin(false)}>
                    No se pueden crear indisponibilidades con el perfil de administrador.
                </Alert>
            </Snackbar>

            <Snackbar open={openSnackbarCreateBusyDates} autoHideDuration={6000} onClose={() => setOpenSnackbarCreateBusyDates(false)}>
                <Alert severity="warning" onClose={() => setOpenSnackbarCreateBusyDates(false)}>
                    No se pueden crear indisponibilidades en la vista de eventos.
                </Alert>
            </Snackbar>

            <Snackbar open={openSnackbarHasBusyDate} autoHideDuration={6000} onClose={() => setOpenSnackbarHasBusyDate(false)}>
                <Alert severity="warning" onClose={() => setOpenSnackbarHasBusyDate(false)}>
                    Ya existe una indisponibilidad para el horario seleccionado.
                </Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{"¿Quieres crear una nueva indisponibilidad?"}</DialogTitle>
                <DialogContent>
                    {selectInfo?.allDay ? <DialogContentText>
                            Se creará una nueva indisponibilidad para todo el{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat("cccc d 'de' LLLL") : null}.
                            <br/><br/>
                            {eventOverlaps ?
                                <span className={'EventOverlaps'}>
                                    <WarningIcon/> Hay eventos que se solapan con esta indisponibilidad.
                                </span> : null
                            }
                        </DialogContentText> :
                        <DialogContentText>
                            Se creará una nueva indisponibilidad el{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat("cccc d 'de' LLLL") : null}
                            {'\u00A0'}desde las{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat(TIME_FORMAT) : null}
                            {'\u00A0'}hasta las{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.end, calendarRef.current.getApi()).toFormat(TIME_FORMAT) : null}.
                            <br/><br/>
                            {eventOverlaps ?
                                <span className={'EventOverlaps'}>
                                    <WarningIcon/> Hay eventos que se solapan con esta indisponibilidad.
                                </span> : null
                            }
                        </DialogContentText>}
                </DialogContent>
                <DialogActions>
                    <ActionButton onClick={handleCloseDialog} color={Color.PRIMARY} innerText={'Cancelar'} variant={ButtonVariant.TEXT}/>
                    <ActionButton onClick={handleAcceptDialog} color={Color.PRIMARY} innerText={'Aceptar'} variant={ButtonVariant.TEXT} autoFocus={true}/>
                </DialogActions>
            </Dialog>
        </>
    );
}