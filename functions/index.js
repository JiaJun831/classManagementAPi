const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const app = express();
app.use(cors());
const db = admin.firestore();

//Timetables method

//get all timetables
app.get('/timetables', async (req, res) => {
    try {
        const snapshot = await db.collection('timetables').get();
        let timetable = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            timetable.push(id, data);
        });
        return res.status(200).send(timetable);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//get timetable by date
app.get('/timetables/:date', async (req, res) => {

    try {
        const snapshot = await db.collection('timetables').doc(req.params.date).get();
        let response = snapshot.data();
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//get all students
app.get('/students', async (req, res) => {
    try {
        const snapshot = await db.collection('students').get();
        let student = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            student.push({ id, data });
        });
        res.status(200).send(student);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//get student by id
app.get('/students/:id', async (req, res) => {
    try {
        const snapshot = await db.collection('students').doc(req.params.id).get();
        let response = snapshot.data();
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//get student by email
app.get('/students/email/:email', async (req, res) => {
    try {
        const snapshot = await db.collection('students').where('Email', '==', req.params.email).get();
        let student = [];

        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            student.push({ id, data });
        });
        res.status(200).send(student);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//get all lecturers
app.get('/lecturers', async (req, res) => {
    try {
        const snapshot = await db.collection('lecturers').get();
        let lecture = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            lecture.push({ id, data });
        });
        res.status(200).send(lecture);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//get lecturers by email
app.get('/lecturers/email/:email', async (req, res) => {

    try {
        const snapshot = await db.collection('lecturers').where('Email', '==', req.params.email).get();
        let lecture = [];

        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            lecture.push({ id, data });
        });
        res.status(200).send(lecture);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//get all modules
app.get('/modules', async (req, res) => {
    try {
        const snapshot = await db.collection('modules').get();
        let module = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            module.push({ id, data });
        });
        res.status(200).send(module);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//get classes by module id
app.get('/classes/module/:id', async (req, res) => {
    try {
        const snapshot = await db.collection('classes').where('module_id', '==', parseInt(req.params.id)).get();
        let classes = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            classes.push({ id, data });
        });
        if (classes.length > 0) {
            res.status(200).send(classes);
        } else {
            res.status(404).send('not found')
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

//get course by courseID
app.get('/courses/:courseID', async (req, res) => {
    try {
        const snapshot = await db.collection('courses').doc(req.params.courseID).get();
        let course = snapshot.data();
        res.status(200).send(course);
    } catch (error) {
        return res.status(500).send(error);
    }
})

//add new timetable
app.post('/timetables', async (req, res) => {
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

//add new classes
app.post('/classes', async (req, res) => {
    try {
        const classes = req.body;
        // const date = classes.date;
        const result = JSON.parse(classes.field);
        await db.collection('classes').doc().set(result);
        res.status(201).send("Success");
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.put('/students/:id', async (req, res) => {
    try {
        const document = db.collection('students').doc(req.params.id);

        await document.update({
            AddressLine1: req.body.AddressLine1,
            AddressLine2: req.body.AddressLine2,
            Country: req.body.Country,
            County: req.body.County,
            CourseID: req.body.CourseID,
            DOB: req.body.DOB,
            EirCode: req.body.EirCode,
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            MobileNumber: req.body.MobileNumber
        });
        return res.status(204).send("Update Succesful");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.put('/modules/:id', async (req, res) => {
    try {
        const document = db.collection('modules').doc(req.params.id);
        await document.update({
            Name: req.body.Name
        });
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(req.body);
    }
});

//update timetable
app.patch('/timetables/:date/:class_id', async (req, res) => {
    try {
        const document = db.collection('timetables').doc(req.params.date);

        await document.update({

        })
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});





exports.api = functions.https.onRequest(app);





////////=======not tested=============////


// ===========not used=============
// //delete timetable by id
// app.delete('/timetables/:date', async (req, res) => {
//     try {
//         const document = db.collection('timetables').doc(req.params.date);
//         await document.delete();
//         return res.status(200).send();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });