import React from 'react';
import FullCalendar, { EventContentArg } from '@fullcalendar/react';
import dayGridPlugin  from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import luxonPlugin from '@fullcalendar/luxon';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.scss';
import {useDispatch, useSelector} from 'react-redux';
import {selectBusyDates} from '../../../app/planner/selectors';
import { addBusy } from '../../../app/planner/slice';

const Test = (eventInfo: EventContentArg) => {
    return (
        <div onClick={() => console.log('asdsad eventInfo.timeText', eventInfo.timeText)}>{eventInfo.timeText}, {eventInfo.event.title}</div>

    )
}

export function Calendar() {

    const busyDates: any = useSelector(selectBusyDates);
    const dispatch = useDispatch();

    const handleDateClick = (arg: any) => {
        console.log(arg)
    };

    const events = [{
        name: 'Event 1',
        participants: ['1', '2', '3', '4'],
        duration: 60,
    }, {
        name: 'Event 2',
        participants: ['5', '6', '7', '8'],
        optional: [ '9', '10' ],
        duration: 60,
    }, {
        name: 'Event 3',
        participants: ['3', '4', '5', '6'],
        duration: 60,
    }, {
        name: 'Event 4',
        participants: ['5', '6'],
        duration: 60,
    }];

    console.log(busyDates)

    return (
        <>
            <FullCalendar
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
                events={busyDates}
                eventDragStart={(info) => console.log("!!!! 1 ", info.event, info.view, info.el)}
                eventDragStop={(info) => console.log("!!!! 2 ", info.event, info.view, info.el)}
                select={(event) => dispatch(addBusy({start: event.start.toISOString(), end: event.end.toISOString(), allDay: event.allDay}))}
                /*eventContent={Test}*/
            />
        </>
    );
}