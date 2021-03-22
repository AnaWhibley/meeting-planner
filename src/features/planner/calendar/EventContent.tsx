import {EventContentArg} from '@fullcalendar/react';
import React from 'react';
import {useDispatch} from 'react-redux';
import {deleteBusy} from '../../../app/planner/slice';
import {toLuxonDateTime} from '@fullcalendar/luxon';
import {Duration} from 'luxon';
import cn from 'classnames';
import {Popover} from '@material-ui/core';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';
import {Tooltip} from '../../../components/tooltip/Tooltip';
import {ReactComponent as TrashIcon} from '../../../assets/icons/evericons/trash-empty.svg';
import './Calendar.scss';
import {statusMapper} from '../eventsGrid/EventsGrid';
export function EventContent(eventInfo: EventContentArg) {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = () => setAnchorEl(divRef.current);
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

    const status = statusMapper(eventInfo.event.extendedProps.status);
    return (
        <div style={style} ref={divRef} className={'EventContainer'} title={eventInfo.event.title}>
                   <span onClick={handleClick} className={cn('EventContent CursorPointer',
                       {
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
                    <div className={cn('InfoIconContainer', status.style)}>{status.icon}</div>
                    <div className={'TextInfoContainer'}>
                        {eventInfo.event.allDay ? 'Todo el día' : <>{start?.toFormat('HH:mm')} - {end?.toFormat('HH:mm')}</>}
                        <hr/>
                        <span>{eventInfo.event.title}</span><br/>
                    </div>
                    {eventInfo.event.extendedProps.canDelete ?
                        <div className={'ActionsContainer'}><Tooltip icon={<TrashIcon/>} text={''} onClick={handleDelete}/></div>
                        : null
                    }
                </div>
            </Popover>
        </div>
    )
}