import React, {useEffect, useRef} from 'react';
import FullCalendar, {DateSelectArg, EventApi, EventContentArg} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import luxonPlugin, {toLuxonDateTime} from '@fullcalendar/luxon';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.scss';
import {useDispatch, useSelector} from 'react-redux';
import {selectBusyDatesCurrentUser, selectBusyDatesOtherUsers} from '../../../app/planner/selectors';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Popover} from '@material-ui/core';
import '../../../styles/common.scss'
import {DATE_TIME_FORMAT} from '../../../app/eventCreator/slice';
import {addBusy, getBusyDates, getEvents} from '../../../app/planner/slice';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import {EventContent} from './EventContent';

export function Calendar() {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEvents())
    }, []);

    const busyDatesCU: any = useSelector(selectBusyDatesCurrentUser);
    const busyDatesOU: any = useSelector(selectBusyDatesOtherUsers);
    const dates = [...busyDatesCU, ...busyDatesOU];

    const calendarRef: React.RefObject<any> = useRef();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectInfo, setSelectInfo] = React.useState<DateSelectArg>();

    const handleOpenDialog = (event: DateSelectArg) => {
        setOpenDialog(true);
        setSelectInfo(event);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAcceptDialog = () => {
        if(selectInfo) {
            dispatch(addBusy(
                {
                    start: toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                    end: toLuxonDateTime(selectInfo.end, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                    allDay: selectInfo.allDay
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
                titleFormat={'LLLL yyyy'}
                timeZone={'UTC'}
                initialView='timeGridWeek'
                weekends={false}
                selectable={true}
                selectMirror={true}
                locale={esLocale}
                height={'auto'}
                slotMinTime={'08:00:00'}
                slotMaxTime={'20:00:00'}
                events={dates}
                select={(event: DateSelectArg) => handleOpenDialog(event)}
                eventContent={(props: EventContentArg) =><EventContent {...props}/>}
                selectOverlap={(event: EventApi) => event.groupId !== 'currentUser'}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{"¿Quieres crear una nueva indisponibilidad?"}</DialogTitle>
                <DialogContent>
                    {selectInfo?.allDay ? <DialogContentText>
                            Se creará una nueva indisponibilidad para todo el{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat("cccc d 'de' LLLL") : null}.
                        </DialogContentText> :
                        <DialogContentText>
                            Se creará una nueva indisponibilidad el{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat("cccc d 'de' LLLL") : null}
                            {'\u00A0'}desde las{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.start, calendarRef.current.getApi()).toFormat('HH:mm') : null}
                            {'\u00A0'}hasta las{'\u00A0'}
                            {selectInfo ? toLuxonDateTime(selectInfo.end, calendarRef.current.getApi()).toFormat('HH:mm') : null}.
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