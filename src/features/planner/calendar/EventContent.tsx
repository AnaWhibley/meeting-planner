import {EventContentArg} from '@fullcalendar/react';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteBusy, deleteBusyDateForEvents} from '../../../app/planner/slice';
import {toLuxonDateTime} from '@fullcalendar/luxon';
import {Duration} from 'luxon';
import cn from 'classnames';
import {Popover} from '@material-ui/core';
import {Tooltip} from '../../../components/tooltip/Tooltip';
import {ReactComponent as TrashIcon} from '../../../assets/icons/evericons/trash-empty.svg';
import './Calendar.scss';
import {statusMapper} from '../eventsGrid/EventsGrid';
import {selectCurrentViewPlanner, ViewPlanner} from '../../../app/uiStateSlice';
import {DATE_TIME_FORMAT, TIME_FORMAT} from '../../../app/eventCreator/slice';
import {ReactComponent as InfoIcon} from '../../../assets/icons/evericons/info.svg';

export function EventContent(eventInfo: EventContentArg) {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClickEvent = () => setAnchorEl(divRef.current);
    const handleClosePopover = () => setAnchorEl(null);
    const openPopover = Boolean(anchorEl);

    const dispatch = useDispatch();

    const start = eventInfo.event.start ? toLuxonDateTime(eventInfo.event.start, eventInfo.view.calendar) : null;
    const end = eventInfo.event.end ? toLuxonDateTime(eventInfo.event.end, eventInfo.view.calendar) : null;
    const diff : Duration = start && end ? end.diff(start, ['minutes']) : Duration.fromMillis(0);

    const handleDeleteBusyDate = () => {
        if(start && end) {
            const busy = {
                id: eventInfo.event.id,
                start: start.toFormat(DATE_TIME_FORMAT),
                end: end.toFormat(DATE_TIME_FORMAT),
                allDay: eventInfo.event.allDay
            }
            dispatch(deleteBusyDateForEvents(start,end));
            dispatch(deleteBusy(busy))
        }
    };


    const divRef: React.RefObject<any> = React.useRef();

    const currentView = useSelector(selectCurrentViewPlanner);

    const status = eventInfo.event.extendedProps.status && statusMapper(eventInfo.event.extendedProps.status);
    const isAllDay = eventInfo.event.allDay;
    const isMonthView = eventInfo.view.type === 'dayGridMonth';
    const canDelete = eventInfo.event.extendedProps.canDelete;
    const title = eventInfo.event.title;

    const style = isMonthView ? {
        background: eventInfo.backgroundColor,
        borderColor: eventInfo.borderColor,
        borderRadius: '3px',
        height: '100%',
        width: '100%'
    } : {height: '100%'};

    return (
        <div style={style}
             ref={divRef}
             className={'EventContainer'}
             title={title}
        >
                   <span onClick={handleClickEvent}
                         className={cn('EventContent CursorPointer', {
                           'Dots': diff.minutes <= 30 || isMonthView || isAllDay,
                           'MonthEventPaddingTop': isMonthView})
                         }
                   >
                       {!isAllDay ? <>{eventInfo.timeText}</> : null}
                       {diff.minutes > 30 && !isAllDay && !isMonthView ?
                           <br/> : isAllDay ? null : ' | '
                       }
                       <>{title}</>
                       {isAllDay ? <> todo el día</> : null}
                   </span>
            <Popover
                onClose={handleClosePopover}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                transformOrigin={{ vertical: 'center', horizontal: 'center' }}
            >
                <div className={'PopoverContent'}>
                    {currentView === ViewPlanner.EVENTS ?
                        <div className={cn('InfoIconContainer', status?.style)}>
                            {status?.icon}
                        </div>
                        :
                        <div className={'InfoIconContainer InfoBackground'}>
                            <InfoIcon className={'FillWhite'}/>
                        </div>
                    }
                    <div className={'TextInfoContainer'}>
                        {isAllDay ?
                            'Todo el día'
                            : <>{start?.toFormat(TIME_FORMAT)} - {end?.toFormat(TIME_FORMAT)}</>
                        }
                        <hr/>
                        <span>{title}</span><br/>
                    </div>
                    {canDelete ?
                        <div className={'ActionsContainer'}>
                            <Tooltip icon={<TrashIcon/>}
                                     text={''}
                                     onClick={handleDeleteBusyDate}/>
                        </div> : null
                    }
                </div>
            </Popover>
        </div>
    )
}