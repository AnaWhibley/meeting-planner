import {search} from "../search";

xdescribe('Basic 2 events', () => {

    beforeEach(() => {
    });

    const basic = {
        groupName: 'Ordinaria 20/21',
        from: "2021 2 10 08 00 00",
        to: "2021 3 15 19 00 00",
        events: [
            {
                id: '11',
                name: 'Defensa TFT Ana Santana',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Titular'
                    }],
                duration: 60,
                status: '',
                date: '',
                time: ''
            }, {
                id: '22',
                name: 'Defensa TFT Jose',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Titular'
                    }],
                duration: 60,
                status: '',
                date: '',
                time: ''
            }
        ]
    };


    xit('should not overlap with 0 indisponibilidades', () => {
        const expected = {
            events: [
                {
                    id: '11',
                    name: 'Defensa TFT Ana Santana',
                    participants: [
                        {
                            email: 'abraham.rodriguez@ulpgc.es',  //1
                            tag: 'Presidente Tribunal Titular'
                        },
                        {
                            email: 'alexis.quesada@ulpgc.es', //8
                            tag: 'Secretario Tribunal Titular'
                        }],
                    duration: 60,
                    status: 'pending',
                    date: '10-02-2021',
                    time: '08:30'
                }, {
                    id: '22',
                    name: 'Defensa TFT Jose',
                    participants: [
                        {
                            email: 'abraham.rodriguez@ulpgc.es',  //1
                            tag: 'Presidente Tribunal Titular'
                        },
                        {
                            email: 'alexis.quesada@ulpgc.es', //8
                            tag: 'Secretario Tribunal Titular'
                        }],
                    duration: 60,
                    status: 'pending',
                    date: '10-02-2021',
                    time: '09:30'
                }
            ],
            busyDates: [
                {
                    userId: 'abraham.rodriguez@ulpgc.es',
                    busy: [{
                        allDay: false,
                        start: '2021 2 10 08 30 00',
                        end: '2021 2 10 09 30 00',
                        eventId: '11',
                        id: '1'
                    }, {
                        allDay: false,
                        start: '2021 2 10 09 30 00',
                        end: '2021 2 10 10 30 00',
                        eventId: '22',
                        id: '1'
                    }]
                },
                {
                    userId: 'alexis.quesada@ulpgc.es',
                    busy: [{
                        allDay: false,
                        start: '2021 2 10 08 30 00',
                        end: '2021 2 10 09 30 00',
                        eventId: '11',
                        id: '1'
                    }, {
                        allDay: false,
                        start: '2021 2 10 09 30 00',
                        end: '2021 2 10 10 30 00',
                        eventId: '22',
                        id: '1'
                    }]
                },
            ]
        }
        const response = search(basic, [], () => '1');

        expect(response).toEqual(expected);
    });

});
