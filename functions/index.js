const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const app = express();
app.use(cors());
// app.use(require('connect').bodyParser());
const db = admin.firestore();

//Timetables method

//get all timetables
app.get('/timetables', (req, res) => {
    (async () => {
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
    })();
});

//add new timetable
app.post('/timetables', (req, res) => {
    (async () => {
        try {
            const timetable = req.body;
            const date = timetable.date;
            const result = JSON.parse(timetable.field);
            await db.collection('timetables').doc(date).set(result);
            res.status(201).send("Success");
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

//get timetable by date
app.get('/timetables/:date', (req, res) => {
    (async () => {
        try {
            const snapshot = db.collection('timetables').doc(req.params.date);
            let item = await snapshot.get();
            let id = item.id;
            let response = item.data();
            let timetable = [];
            timetable.push(id, response);
            return res.status(200).send(timetable);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

// //delete timetable by id
app.delete('/timetables/:timetable_id', async (req, res) => {
    try {
        const document = db.collection('timetables').doc(req.params.timetable_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
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
app.get('/students/:id', (req, res) => {
    (async () => {
        try {
            const snapshot = db.collection('students').doc(req.params.id);
            let item = await snapshot.get();
            let id = item.id;
            let response = item.data();
            let student = [];
            student.push(id, response);
            return res.status(200).send(student);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

//get student by email
app.get('/students/email/:email', (req, res) => {
    (async () => {
        try {
            const snapshot = await db.collection('students').get();
            let student = [];

            snapshot.forEach(doc => {
                let id = doc.id;
                let data = doc.data();
                if (req.params.email === data.Email) {
                    student.push({ id, data });
                }
            });
            res.status(200).send(student);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
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
app.get('/lecturers/email/:email', (req, res) => {
    (async () => {
        try {
            const snapshot = await db.collection('lecturers').get();
            let lecture = [];

            snapshot.forEach(doc => {
                let id = doc.id;
                let data = doc.data();
                if (req.params.email === data.Email) {
                    lecture.push({ id, data });
                }
            });
            res.status(200).send(lecture);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
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
        return res.status(200).send("Update Succesful");
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
        return res.status(200).send(req.body);
    } catch (error) {
        console.log(error);
        return res.status(500).send(req.body);
    }
});


app.get('/classes', (req, res) => {
    (async () => {
        try {
            const snapshot = await db.collection('classes').get();
            let timetable = [];
            snapshot.forEach(doc => {
                let id = doc.id;
                let data = doc.data();
                classes.push(id, data);
            });
            return res.status(200).send(classes);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});


//add new timetable
app.post('/classes', (req, res) => {
    (async () => {
        try {
            const classes = req.body;
            // const date = classes.date;
            const result = JSON.parse(classes.field);
            await db.collection('classes').doc().set(result);
            res.status(201).send("Success");
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});





exports.api = functions.https.onRequest(app);





////////=======not tested=============////
//update timetable
// app.put('/timetables/:date', async (req, res) => {
//     try {
//         const document = db.collection('timetables').doc(req.params.date);
//         await document.update({
//             Classes:[{
//                 req.body.id
//             }] req.body.active,
//         });
//         return res.status(200).send();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// });