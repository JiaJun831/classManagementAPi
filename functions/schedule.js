const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();


exports.scheduledFunction = functions.pubsub.schedule('55 23 1-31 * 7').onRun((context) => {
    const document = db.collection('modules').doc(req.params.id);
});