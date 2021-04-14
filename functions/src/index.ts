import firebase from 'firebase';
import {Change, EventContext} from 'firebase-functions';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import {firestore} from 'firebase-admin/lib/firestore';
import DocumentData = firestore.DocumentData;
import QuerySnapshot = firestore.QuerySnapshot;
import {welcomeTemplate} from './templates/welcomeTemplate';
import {newEventsTemplate} from './templates/newEventsTemplate';
import {reminderTemplate} from './templates/reminderTemplate';

export interface ParticipantDto {
    email: string;
    confirmed: boolean;
    tag: string;
}

export interface EventDto {
    id: string;
    name: string;
    participants: Array<ParticipantDto>;
    duration: number;
    status: string;
    date: string;
    time: string;
    color?: string;
}

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {DateTime} = require('luxon');
admin.initializeApp();

const options = {
    memory: '2GB',
    timeoutSeconds: 540
};

// Function for creating an auth account on adding user
exports.createUser = functions.firestore
    .document('users/{userId}')
    .onCreate((snapshot: QueryDocumentSnapshot, context: EventContext) => {
        return admin.auth().createUser({
            email: context.params.userId,
            password: 'anaTFG'
        }).then(() => {
            functions.logger.info('Executed createUser for ', context.params.userId);
        });
    });

// Function for sending email to participants of events when a grouped event is created
exports.sendEmailGroupedEventCreated = functions.firestore
    .document('events/{groupedEventId}')
    .onCreate((snapshot: QueryDocumentSnapshot, context: EventContext) => {
        const events: Array<EventDto> = snapshot.data().events;
        const mapParticipants = new Map<string, Array<string>>();
        events.forEach((event) =>
            event.participants.forEach((participant) => {
                const array = mapParticipants.get(participant.email) || [];
                array.push(event.name);
                mapParticipants.set(participant.email, array);
            }));
        const promises = [];
        for (const entry of mapParticipants) {
            promises.push(admin.firestore().collection('mail').add({
                // to: entry[0],
                to: 'anawhibley@gmail.com',
                message: {
                    subject: 'Tienes nuevas lecturas asignadas',
                    html: newEventsTemplate(snapshot.data().groupName, entry[1]),
                }
            }));
        }

        return Promise.all(promises).then(() => {
            functions.logger.info('Executed sendEmailGroupedEventCreated for ', context.params.userId);
        });
    });

// Function for sending email to participants of events when an event is created
exports.sendEmailEventCreated = functions.firestore
    .document('events/{groupedEventId}')
    .onUpdate((change: Change<QueryDocumentSnapshot>, context: EventContext) => {
        const eventsBefore = change.before.data().events;
        const eventsAfter = change.after.data().events;
        if (eventsAfter.length <= eventsBefore) {
            return;
        }
        const eventsIdsBefore = eventsBefore.map((event: EventDto) => event.id);
        const newEvents = eventsAfter.filter((event: EventDto) => !eventsIdsBefore.includes(event.id));
        const mapParticipants = new Map<string, Array<string>>();
        newEvents.forEach((event: EventDto) =>
            event.participants.forEach((participant) => {
                const array = mapParticipants.get(participant.email) || [];
                array.push(event.name);
                mapParticipants.set(participant.email, array);
            }));
        const promises = [];
        for (const entry of mapParticipants) {
            promises.push(admin.firestore().collection('mail').add({
                // to: entry[0],
                to: 'anawhibley@gmail.com',
                message: {
                    subject: 'Tienes nuevas lecturas asignadas',
                    html: newEventsTemplate(change.before.data().groupName, entry[1]),
                }
            }));
        }

        return Promise.all(promises).then(() => {
            functions.logger.info('Executed sendEmailEventCreated for ', context.params.userId);
        });
    });

// Function for sending welcome emails
exports.sendEmailNewUsers = functions.firestore
    .document('users/{userId}')
    .onCreate((snapshot: QueryDocumentSnapshot, context: EventContext) => {
        return admin.firestore().collection('mail').add({
            // to: context.params.userId
            to: 'anawhibley@gmail.com',
            message: {
                subject: 'Meeting Planner te da la bienvenida',
                html: welcomeTemplate(),
            }
        }).then(() => {
            functions.logger.info('Executed sendEmailNewUsers for ', context.params.userId);
        });
    });

// Function for sending reminders
exports.sendReminder = functions.runWith(options).pubsub.topic('sendReminder').onPublish(() => {
    return admin.firestore().collection('events').get().then((snapshot: QuerySnapshot<DocumentData>) => {
        const mapParticipants = new Map<string, Array<string>>();
        snapshot.forEach((groupedEvent) => {
            const groupedEventStart = DateTime.fromFormat(groupedEvent.data().from, 'dd/MM/yyyy');
            const groupedEventEnd = DateTime.fromFormat(groupedEvent.data().to, 'dd/MM/yyyy');
            const diffStart = groupedEventStart.diffNow('days').days;
            const diffEnd = groupedEventEnd.diffNow('days').days;
            if (diffEnd < 0 || diffStart < 0) {
                return;
            } else if (diffStart > 0 && diffStart < 31) {
                const events: Array<EventDto> = groupedEvent.data().events;
                events.forEach((event) => {
                    // If not a confirmed event
                    if (event.status !== 'confirmed') {
                        const participants = event.participants;
                        participants.forEach((participant) => {
                            // If participant has not confirmed attendance
                            if (!participant.confirmed) {
                                const array = mapParticipants.get(participant.email) || [];
                                array.push(event.name);
                                mapParticipants.set(participant.email, array);
                            }
                        });
                    }
                });
            }
        });
        const promises = [];
        for (const entry of mapParticipants) {
            promises.push(admin.firestore().collection('mail').add({
                // to: entry[0],
                to: 'anawhibley@gmail.com',
                message: {
                    subject: 'Recuerda que tienes eventos pendientes',
                    // Cambiar a template usando una tabla
                    html: reminderTemplate(entry[1]),
                }
            }));
        }
        return Promise.all(promises).then(() => {
            functions.logger.info('Executed sendReminder');
        });
    });
});

// Function to notify to admin events with search errors
exports.notifyErrorOnGroupedEvent = functions.firestore.document('events/{groupedEventId}')
    .onUpdate((change: Change<QueryDocumentSnapshot>, context: EventContext) => {
        const newValue = change.after.data();
        const eventsError = new Set<string>();
        newValue.events.forEach((event: EventDto) => {
            if (event.status === 'error') {
                eventsError.add(event.name);
            }
        });
        if (eventsError.size > 0) {
            return admin.firestore().collection('mail').add({
                to: 'meetingplannertfg@gmail.com',
                message: {
                    subject: 'Hay eventos con errores',
                    html: 'Ups, parece que hay eventos con errores. Accede a la plataforma para verlos.',
                }
            });
        }
    });


// Function to update event status to confirmed
exports.updateEventStatus = functions.firestore.document('events/{groupedEventId}')
    .onUpdate((change: Change<QueryDocumentSnapshot>, context: EventContext) => {
        const groupedEventId = context.params.groupedEventId;
        const newValue = change.after.data();
        newValue.events.forEach((event: EventDto) => {
            if (event.status === 'pending') {
                if (event.participants.every((participant) => participant.confirmed)) {
                    const newEvents = newValue.events;
                    const index = newEvents.findIndex((e: EventDto) => e.id === event.id);
                    if (index > -1) {
                        newEvents.splice(index, 1);
                        const newEventData = {
                            ...event,
                            status: 'confirmed'
                        };
                        newEvents.push(newEventData);
                    }
                    return admin.firestore().doc(`events/${groupedEventId}`)
                        .set({events: newEvents}, {merge: true}).then(() => {
                            functions.logger.info('Successfully executed updateEventStatus for ', event.id);
                        });
                }
            }
        });
    });

