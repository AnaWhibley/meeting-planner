import {search} from './sum';

describe('basic 1 event', () => {

    beforeEach(() => {
    });

    const a = {
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
                    },
                    {
                        email: 'daniel.hernandez@ulpgc.es',    //3
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: '2021 2 26',
                time: '10:30'
            },
            {
                id: '22',
                name: 'Defensa TFT Lara Viera',
                participants: [
                    {
                        email: 'octavio.mayor@ulpgc.es',  //7
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'francisco.alayon@ulpgc.es', //2
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'francisca.quintana@ulpgc.es',    //9
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: '2021 2 28',
                time: '12:30'
            },
            {
                id: '33',
                name: 'Defensa TFT Juan Sánchez',
                participants: [
                    {
                        email: 'abraham.rodriguez@ulpgc.es',  //1
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'francisco.alayon@ulpgc.es', //2
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'daniel.hernandez@ulpgc.es',    //3
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'octavio.mayor@ulpgc.es',  //7
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'alexis.quesada@ulpgc.es', //8
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'francisca.quintana@ulpgc.es',    //9
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'pending',
                date: 'pending',
                time: 'pending'
            },
            {
                id: '44',
                name: 'Defensa TFT Pedro Sánchez',
                participants: [
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 60,
                status: 'error',
                date: '2021 2 28',
                time: '14:30'
            },
            {
                id: '55',
                name: 'Defensa TFT Francisco Santana',
                participants: [
                    {
                        email: 'domingo.benitez@ulpgc.es',  //4
                        tag: 'Presidente Tribunal Titular'
                    },
                    {
                        email: 'antonio.ocon@ulpgc.es',  //5
                        tag: 'Secretario Tribunal Titular'
                    },
                    {
                        email: 'jc.rodriguezdelpino@ulpgc.es',  //6
                        tag: 'Vocal Tribunal Titular'
                    },
                    {
                        email: 'carmelo.cuenca@ulpgc.es',  //10
                        tag: 'Presidente Tribunal Suplente'
                    },
                    {
                        email: 'david.freire@ulpgc.es',  //11
                        tag: 'Secretario Tribunal Suplente'
                    },
                    {
                        email: 'eduardo.rodriguez@ulpgc.es',  //12
                        tag: 'Vocal Tribunal Suplente'
                    }],
                duration: 90,
                status: 'confirmed',
                date: '2021 1 30',
                time: '15:30'
            },
        ]
    };

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
            }
        ]
    };


    it('0 indisponibilidades', () => {
        const basicResult = {
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
                    }]
                },
            ]
        }
        expect(search(basic, [], () => '1')).toEqual(basicResult);
    });

    it('1 indisponibilidad boundary', () => {
        const basicResult = {
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
                    time: '17:30'
                }
            ],
            busyDates: [
                {
                    userId: 'alexis.quesada@ulpgc.es',
                    busy: [{
                        allDay: false,
                        start: '2021 2 10 08 30 00',
                        end: '2021 2 10 17 30 00',
                        eventId: '11',
                        id: '1'
                    }, {
                        allDay: false,
                        start: '2021 2 10 17 30 00',
                        end: '2021 2 10 18 30 00',
                        eventId: '11',
                        id: '1'
                    }]
                },
                {
                    userId: 'abraham.rodriguez@ulpgc.es',
                    busy: [{
                        allDay: false,
                        start: '2021 2 10 17 30 00',
                        end: '2021 2 10 18 30 00',
                        eventId: '11',
                        id: '1'
                    }]
                },
            ]
        }
        expect(search(basic, [
            {
                userId: 'alexis.quesada@ulpgc.es',
                busy: [{
                    allDay: false,
                    start: '2021 2 10 08 30 00',
                    end: '2021 2 10 17 30 00',
                    eventId: '11',
                    id: '1'
                }]
            }], () => '1')).toEqual(basicResult);
    });


});
