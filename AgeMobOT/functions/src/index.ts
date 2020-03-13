import * as functions from 'firebase-functions';

//const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Listen for changes in all documents in the 'users' collection and all subcollections
exports.useMultipleWildcards = functions.firestore
    .document('users/{userId}/{messageCollectionId}/{messageId}')
    .onCreate((snap, context) => {

      const notification = snap.data();

      if (notification != null){

        admin.firestore().collection('users').get().then(
          (users: any[]) => users.forEach((user: any) => {
            if (user.id == context.params.userId){
              console.log('c e una notifica per ' + user.data().student +
              ' che dice ' + notification.text);
            }
          })
        )
        }
    });


