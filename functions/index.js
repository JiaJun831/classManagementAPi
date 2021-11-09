const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const app = express();

const db = admin.firestore();

//Timetables method

//get all timetables
app.get('/timetables/get', async (req, res) => {
    try {
        const snapshot = await db.collection('timetables').get();
        let timetable = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            timetable.push(id, data);
        });
        res.status(200).send(timetable);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//add new timetable
app.post('/timetables/add', async (req, res) => {
    try {
        const timetable = req.body;
        const date = timetable.date;
        const result = JSON.parse(timetable.field);
        await db.collection('timetables').doc(date).set(result);
        res.status(201).send("Success");
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get('/timetables/get/:date', async (req, res) => {
    try {
        const docRef = db.collection('timetables').doc(req.params.date);
        let timetable = [];
        let text = "";
        const snapshot = await docRef.get();
        if (snapshot.exists) {
            snapshot.forEach(doc => {
                text = doc.id, '=>', doc.data();
                // let id = doc.id;
                // let data = doc.data();
                // timetable.push(id, data);
            });
        } else {
            // text = "fail";
        }
        res.status(200).send(text);
    } catch (error) {
        return res.status(500).send(error);
    }
})

// app.put('/timetables/update/:timetable_id', async (req, res) => {
//     try {
//         const document = db.collection('timetables').doc(req.params.timetable_id);
//         await document.update({
//             timetable: req.body.timetable
//         });
//         return res.status(200).send();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });

// //delete timetable by id
// app.delete('/timetables/delete/:timetable_id', async (req, res) => {
//     try {
//         const document = db.collection('timetables').doc(req.params.timetable_id);
//         await document.delete();
//         return res.status(200).send();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });

// app.get('/students/get', async (req, res) => {
//     try {
//         const snapshot = await db.collection('students').get();
//         let student = [];
//         snapshot.forEach(doc => {
//             let id = doc.id;
//             let data = doc.data();
//             timetable.push({ id, ...data });
//         });
//         res.status(200).send(student);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });

// app.get('/lectures/get', async (req, res) => {
//     try {
//         const snapshot = await db.collection('lectures').get();
//         let lecture = [];
//         snapshot.forEach(doc => {
//             let id = doc.id;
//             let data = doc.data();
//             timetable.push({ id, ...data });
//         });
//         res.status(200).send(lecture);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });

// app.get('/modules/get', async (req, res) => {
//     try {
//         const snapshot = await db.collection('modules').get();
//         let module = [];
//         snapshot.forEach(doc => {
//             let id = doc.id;
//             let data = doc.data();
//             timetable.push({ id, ...data });
//         });
//         res.status(200).send(module);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });
//update Timetable by id


exports.api = functions.https.onRequest(app);