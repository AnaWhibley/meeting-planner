import firebase from 'firebase';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import {EventContext} from 'firebase-functions';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

exports.createUser = functions.firestore
    .document('users/{userId}')
    .onCreate((snapshot: QueryDocumentSnapshot, context: EventContext) => {
        const email = context.params.userId;
        functions.logger.info('1. Executed createUser for ', email);
        return admin.auth().createUser({
            email: email,
            password: 'anaTFG'
        }).then(() => {
            functions.logger.info('2. Executed createUser for ', context.params.userId);
        });
    });
