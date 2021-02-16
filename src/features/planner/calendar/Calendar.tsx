import React, {useRef} from 'react';
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
import {ReactComponent as TrashIcon} from '../../../assets/icons/evericons/trash-empty.svg';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import {Tooltip} from '../../../components/tooltip/Tooltip';
import '../../../styles/common.scss'
import {DATE_TIME_FORMAT} from '../../../app/eventCreator/slice';
import {addBusy, deleteBusy} from '../../../app/planner/slice';
import {Duration} from 'luxon';
import ActionButton, {ButtonVariant} from '../../../components/actionButton/ActionButton';
import {Color} from '../../../styles/theme';
import cn from 'classnames';

const EventContent = (eventInfo: EventContentArg) => {

    const condition = (eventInfo.view.type === 'dayGridMonth' && eventInfo.event.groupId === 'currentUser') || eventInfo.view.type === 'timeGridWeek';
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = () => { if(condition) setAnchorEl(divRef.current) };
    const handleClose = () => setAnchorEl(null);
    const openPopover = Boolean(anchorEl);

    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteBusy(eventInfo.event.id))
    };

    const start = eventInfo.event.start ? toLuxonDateTime(eventInfo.event.start, eventInfo.view.calendar) : null;
    const end = eventInfo.event.end ? toLuxonDateTime(eventInfo.event.end, eventInfo.view.calendar) : null;
    const diff : Duration = start && end ? end.diff(start, ['minutes']) : Duration.fromMillis(0);

    const style = eventInfo.view.type === 'dayGridMonth' ? {
        background: eventInfo.backgroundColor,
        borderColor: eventInfo.borderColor,
        borderRadius: '3px',
        height: '100%',
        width: '100%'
    } : {
        height: '100%',
    };
    const divRef: React.RefObject<any> = React.useRef();
    return (
        <div style={style} ref={divRef} className={'EventContainer'}>
                   <span onClick={handleClick} className={cn('EventContent',
                       {
                           'CursorPointer': condition,
                           'Dots': diff.minutes <= 30 || eventInfo.view.type === 'dayGridMonth' || eventInfo.event.allDay,
                           'MonthEventPaddingTop': eventInfo.view.type === 'dayGridMonth'
                       })}
                   >
                       {!eventInfo.event.allDay ? <>{eventInfo.timeText}</> : null}
                       {diff.minutes > 30 && !eventInfo.event.allDay && eventInfo.view.type !== 'dayGridMonth' ? <br/> : eventInfo.event.allDay ? null : ' | '}
                       <>{eventInfo.event.title}</>
                       <>{eventInfo.event.allDay ? ' todo el día' : null}</>
                   </span>
            <Popover
                onClose={handleClose}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <div className={'PopoverContent'}>
                    <InfoIcon className={'FillPrimary'}/><br/>
                    {eventInfo.event.allDay ? 'Todo el día' : <>{eventInfo.timeText}</>}
                    <hr/>
                    <span>{eventInfo.event.title}</span><br/>
                    {eventInfo.event.extendedProps.canDelete ?
                        <Tooltip icon={<TrashIcon/>} text={'Eliminar'} onClick={handleDelete}/>
                        : null
                    }
                </div>
            </Popover>
        </div>
    )
}

export function Calendar() {

    const busyDatesCU: any = useSelector(selectBusyDatesCurrentUser);
    const busyDatesOU: any = useSelector(selectBusyDatesOtherUsers);
    const dates = [...busyDatesCU, ...busyDatesOU]

    const dispatch = useDispatch();

    const handleDateClick = (arg: any) => {
        console.log(arg)
    };

    const calendarRef: React.RefObject<any> = useRef();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectInfo, setSelectInfo] = React.useState<DateSelectArg>();

    const handleClickOpenDialog = (event: DateSelectArg) => {
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
                dateClick={handleDateClick}
                slotMinTime={'08:00:00'}
                slotMaxTime={'20:00:00'}
                events={dates}
                select={(event: DateSelectArg) => handleClickOpenDialog(event)}
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