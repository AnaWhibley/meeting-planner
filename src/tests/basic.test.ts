import {search} from "../search";
import {mockEvent, mockEventsResult} from "./utils";

describe('Caso básico un evento', () => {

    const oneEventTwoParticipants = mockEvent("2021 05 03 08 00 00",
        "2021 05 31 19 00 00", ['abraham.rodriguez@ulpgc.es', 'alexis.quesada@ulpgc.es']);

    it('0 indisponibilidades', () => {

        const busyDatesResult = [{
            userId: 'abraham.rodriguez@ulpgc.es',
            busy: [{
                allDay: false,
                start: '2021 05 03 08 30 00',
                end: '2021 05 03 09 30 00',
                eventId: '11',
                id: ''
            }]
        },
            {
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 08 30 00',
                    end: '2021 05 03 09 30 00',
                    eventId: '11',
                    id: ''
                }]
            },
        ];

        const eventsResult = mockEventsResult(oneEventTwoParticipants, ['pending'], ['03-05-2021'], ['08:30'])
        expect(search(oneEventTwoParticipants, [], () => '').events).toEqual(eventsResult);
        expect(search(oneEventTwoParticipants, [], () => '').busyDates).toEqual(busyDatesResult);
    });

    it('1 indisponibilidad en el límite del día', () => {

        const eventsResult = mockEventsResult(oneEventTwoParticipants, ['pending'], ['03-05-2021'], ['17:30'])

        const busyDatesResult = [{
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 08 30 00',
                    end: '2021 05 03 17 30 00',
                    id: ''
                }, {
                    allDay: false,
                    start: '2021 05 03 17 30 00',
                    end: '2021 05 03 18 30 00',
                    eventId: '11',
                    id: ''
                }]
        }, {
                userId: 'abraham.rodriguez@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 17 30 00',
                    end: '2021 05 03 18 30 00',
                    eventId: '11',
                    id: ''
                }]
            },
        ];

        expect(search(oneEventTwoParticipants, [
            {
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 08 30 00',
                    end: '2021 05 03 17 30 00',
                    id: ''
                }]
            }], () => '').events).toEqual(eventsResult);


        expect(search(oneEventTwoParticipants, [
            {
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 08 30 00',
                    end: '2021 05 03 17 30 00',
                    id: ''
                }]
            }], () => '').busyDates).toEqual(busyDatesResult);

    });

    it('1 indisponibilidad último slot del día no posible', () => {

        const eventsResult = mockEventsResult(oneEventTwoParticipants, ['pending'], ['04-05-2021'], ['08:30'])

        const busyDatesResult = [
                {
                    userId: 'alexis.quesada@ulpgc.es',
                    busy: [{
                        allDay: false,
                        start: '2021 05 03 08 30 00',
                        end: '2021 05 03 18 00 00',
                        id: ''
                    }, {
                        allDay: false,
                        start: '2021 05 04 08 30 00',
                        end: '2021 05 04 09 30 00',
                        eventId: '11',
                        id: ''
                    }]
                },
                {
                    userId: 'abraham.rodriguez@ulpgc.es',
                    busy: [{
                        allDay: false,
                        start: '2021 05 04 08 30 00',
                        end: '2021 05 04 09 30 00',
                        eventId: '11',
                        id: ''
                    }]
                },
            ];

        expect(search(oneEventTwoParticipants, [
            {
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 08 30 00',
                    end: '2021 05 03 18 00 00',
                    id: ''
                }]
            }], () => '').busyDates).toEqual(busyDatesResult);

        expect(search(oneEventTwoParticipants, [
            {
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 05 03 08 30 00',
                    end: '2021 05 03 18 00 00',
                    id: ''
                }]
            }], () => '').events).toEqual(eventsResult);

    });

});
