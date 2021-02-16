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
import {Popover} from '@material-ui/core';
import {ReactComponent as TrashIcon} from '../../../assets/icons/evericons/trash-empty.svg';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import { Tooltip } from '../../../components/tooltip/Tooltip';
import '../../../styles/common.scss'

const Test = (eventInfo: EventContentArg) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = () => {
        setAnchorEl(divRef.current);
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
    const divRef: React.RefObject<any> = React.useRef();
    return (
        <div style={style} ref={divRef} className={'PopoverContainer'}>
            {eventInfo.view.type === 'dayGridMonth' ?
                <span className={'EventContent'}>{eventInfo.timeText} | {eventInfo.event.title}</span>
                :
                <>
                   <span onClick={handleClick} className={'EventContent'}>
                    {eventInfo.timeText}<br/>{eventInfo.event.title}
                   </span>
                    <Popover
                        onClose={handleClose}
                        open={open}
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
                        <div className={'PopoverContainer'}>
                            <div className={'PopoverContent'}>
                                <InfoIcon className={'FillPrimary'}/><br/>
                                <span>{eventInfo.timeText}</span><br/><hr/>
                                <span>{eventInfo.event.title}</span><br/>
                                {eventInfo.event.extendedProps.canDelete ?
                                    <Tooltip icon={<TrashIcon/>} text={'Eliminar'} onClick={() => console.log('eliminar')}/>
                                    : null
                                }
                            </div>
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
                    dispatch(addBusy(
                        {
                            start: toLuxonDateTime(event.start, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                            end: toLuxonDateTime(event.end, calendarRef.current.getApi()).toFormat(DATE_TIME_FORMAT),
                            allDay: event.allDay
                        })
                    );
                }}
                eventContent={(props) =><Test {...props} />}
                selectOverlap={(event) => event.groupId !== 'currentUser'}
            />
        </>
    );
}