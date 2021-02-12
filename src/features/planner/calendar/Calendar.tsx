import React, {useEffect, useRef, useState} from 'react';
import FullCalendar, {EventContentArg} from '@fullcalendar/react';
import dayGridPlugin  from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import luxonPlugin, {toLuxonDateTime} from '@fullcalendar/luxon';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.scss';
import {useDispatch, useSelector} from 'react-redux';
import {selectBusyDates} from '../../../app/planner/selectors';
import {addBusy, BusyState} from '../../../app/planner/slice';
import {DateTime} from 'luxon';

const Test = (eventInfo: EventContentArg) => {
    return (
        <div onClick={() => console.log('asdsad eventInfo.timeText', eventInfo.timeText)}>{eventInfo.timeText}, {eventInfo.event.title}</div>

    )
}

export function Calendar() {

    const busyDates: any = useSelector(selectBusyDates);
    const dates = busyDates.map((date: BusyState) => {
        const a = DateTime.fromFormat(date.start, "yyyy L dd HH mm ss");
        console.log("!!! afdhsf", date.start, a, a.toJSDate())
        return {
            ...date,
            start: DateTime.fromFormat(date.start, 'yyyy L dd HH mm ss').toJSDate(),
            end: DateTime.fromFormat(date.end, 'yyyy L dd HH mm ss').toJSDate()
        }

    });

    const dispatch = useDispatch();

    const handleDateClick = (arg: any) => {
        console.log(arg)
    };

    const calendarRef: any = useRef();
    console.log(dates)

    useEffect(() =>{
        console.log(calendarRef.current);
    }, [calendarRef]);

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
                            start: toLuxonDateTime(event.start, calendarRef.current.getApi()).toFormat("yyyy L dd HH mm ss"),
                            end: toLuxonDateTime(event.end, calendarRef.current.getApi()).toFormat("yyyy L dd HH mm ss"),
                            allDay: event.allDay
                        })
                    );
                }}

                /*eventContent={Test}*/
            />
        </>
    );
}