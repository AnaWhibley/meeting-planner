import React, {useRef} from 'react';
import FullCalendar, {EventContentArg} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import luxonPlugin, {toLuxonDateTime} from '@fullcalendar/luxon';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.scss';
import {useDispatch, useSelector} from 'react-redux';
import {selectBusyDatesCurrentUser, selectBusyDatesOtherUsers} from '../../../app/planner/selectors';
import {addBusy} from '../../../app/planner/slice';
import {DATE_TIME_FORMAT} from '../../../app/eventCreator/slice';
import {Button, Popover} from '@material-ui/core';


const Test = (eventInfo: EventContentArg) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const style = eventInfo.view.type === 'dayGridMonth' ? {
        background: eventInfo.backgroundColor,
        borderColor: eventInfo.borderColor,
        borderRadius: '3px',
        height: '100%',
        width: '100%',
    } : {
        height: '100%',
    };

    console.log('Event info ', eventInfo)
    return (
        <div style={style}>
            {eventInfo.view.type === 'dayGridMonth' ?
                <span style={{height: '100%', display: 'inline-block'}}>
                {eventInfo.timeText} {eventInfo.event.title}
            </span>
                :
                <>
               <span onClick={handleClick} style={{height: '100%', display: 'inline-block'}}>
                {eventInfo.timeText} {eventInfo.event.title}</span>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div>
                            {eventInfo.timeText} {eventInfo.event.title}
                            <br/>
                            {eventInfo.event.extendedProps.canDelete ? <Button>Eliminar</Button> : null}
                        </div>
                    </Popover>
                </>
            }
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
                select={(event) => {
                    console.log('hola')
                    dispatch(addBusy(
                        {
                            start: toLuxonDateTime(event.start, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                            end: toLuxonDateTime(event.end, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                            allDay: event.allDay
                        })
                    );
                }}
                eventContent={(props) =><Test {...props} />}
            />
        </>
    );
}