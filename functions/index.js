const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();
const app = express();
app.use(cors());
const db = admin.firestore();
// const googleStorage = require('@google-cloud/storage');
// const Multer = require('multer');

// // const storage = googleStorage({
// //     projectId: "attendancetracker-a53a9",
// //     keyFilename: "AIzaSyC1IMED0fuuCze3BwdGft3beKSiFpZ4zM8"
// // });

// // const bucket = storage.bucket("attendancetracker-a53a9.appspot.com");

// const multer = Multer({
//     storage: Multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
//     }
// });

/**
 * Adding new file to the storage
 */
// app.post('/upload', multer.single('file'), (req, res) => {
//     console.log('Upload Image');

//     let file = req.file;
//     if (file) {
//         uploadImageToStorage(file).then((success) => {
//             res.status(200).send({
//                 status: 'success'
//             });
//         }).catch((error) => {
//             console.error(error);
//         });
//     }
// });

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
// const uploadImageToStorage = (file) => {
//     return new Promise((resolve, reject) => {
//         if (!file) {
//             reject('No image file');
//         }
//         let newFileName = `${file.originalname}_${Date.now()}`;

//         let fileUpload = bucket.file(newFileName);

//         const blobStream = fileUpload.createWriteStream({
//             metadata: {
//                 contentType: file.mimetype
//             }
//         });

//         blobStream.on('error', (error) => {
//             reject('Something is wrong! Unable to upload at the moment.');
//         });

//         blobStream.on('finish', () => {
//             // The public URL can be used to directly access the file via HTTP.
//             const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//             resolve(url);
//         });

//         blobStream.end(file.buffer);
//     });
// }
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
        return res.status(500).send(error.message);
    }
});

//get timetable by date
app.get('/timetables/:date', async (req, res) => {

    try {
        const snapshot = await db.collection('timetables').doc(req.params.date).get();
        let response = snapshot.data();
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send(error.message);
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
        return res.status(500).send(error.message);
    }
});

//get student by id
app.get('/students/:id', async (req, res) => {
    try {
        const snapshot = await db.collection('students').doc(req.params.id).get();
        let response = snapshot.data();
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send(error.message);
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
        return res.status(500).send(error.message);
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
        return res.status(500).send(error.message);
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
        return res.status(500).send(error.message);
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
        return res.status(500).send(error.message);
    }
});

//get classes by module id
app.post('/classes/module', async (req, res) => {
    try {

        let array = req.body.text.split(',').map(function (item) {
            return parseInt(item);
        });
        const snapshot = await db.collection('classes').where('module_id', 'in', array).orderBy('timeslot.dayIndex', 'asc').orderBy('timeslot.start_time', 'asc').get();
        let classes = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            classes.push({ id, data });
        });
        res.status(200).send(classes);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//get course by courseID
app.get('/courses/:courseID', async (req, res) => {
    try {
        const snapshot = await db.collection('courses').doc(req.params.courseID).get();
        let course = snapshot.data();
        res.status(200).send(course);
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

//get module by moduleID
app.get('/modules/:moduleID', async (req, res) => {
    try {
        const snapshot = await db.collection('modules').doc(req.params.moduleID).get();
        let module = snapshot.data();
        res.status(200).send(module);
    } catch (error) {
        return res.status(500).send(error.message);
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
        return res.status(500).send(error.message);
    }
});

//add new timetable
app.post('/students', async (req, res) => {
    try {
        const student = req.body;
        const id = student.id;
        const result = JSON.parse(student.field);
        await db.collection('students').doc(id).set(result);
        res.status(201).send("Success");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});


app.post('/notificationToken', async (req, res) => {

    try {
        const postData = {
            userID: req.body.userID,
            token: req.body.token
        }
        await db.collection('notificationToken').doc().set(postData);
        res.status(201).send("Success");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//add new classes
app.post('/classes', async (req, res) => {
    try {
        const classes = req.body;
        const result = JSON.parse(classes.field);
        await db.collection('classes').doc().set(result);
        res.status(201).send("Success");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.patch('/:role/:id', async (req, res) => {
    try {
        const document = db.collection(req.params.role).doc(req.params.id);
        console.log(req.body);
        console.log(req.params.role);
        console.log(req.params.id);
        await document.update({
            AddressLine1: req.body.AddressLine1,
            AddressLine2: req.body.AddressLine2,
            Country: req.body.Country,
            County: req.body.County,
            DOB: req.body.DOB,
            EirCode: req.body.EirCode,
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            MobileNumber: req.body.MobileNumber
        });
        return res.status(204).send("Update Succesful");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});


// not used
app.put('/modules/:id', async (req, res) => {
    try {
        const document = db.collection('modules').doc(req.params.id);
        await document.update({
            Name: req.body.Name
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//update timetable
// app.patch('/timetables/:date/:class_id', async (req, res) => {
//     try {
//         //get class in timetables this week set it to false
//         const document1 = db.collection('timetables').doc(req.params.date).where('class_id', '==', req.params.class_id);

//         //create a new class in classes table to store new class details
//         // const document2 = db.collection('classes').doc().set(req.body.newClass);
//         const document3 = db.collection('timetables').doc(req.params.date).update(req.body.newTimetable);

//         //update the current class to false and add a new class into it
//         await document1.update({
//             active: false
//         })
//         return res.status(204).send();
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// });


// app.get('/timetables/test/test', async (req, res) => {
//     try {
//         const document1 = await db.collection('timetables').where('class_id', 'array-contains', '704o2zHFJY6IENYO3diY').get();
//         let classes = [];
//         document1.forEach(doc => {
//             let id = doc.id;
//             let data = doc.data();
//             classes.push({ id, data });
//         });
//         // let response = document1.data();
//         res.status(200).send(classes);
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// });


exports.api = functions.runWith({ minInstances: 0 }).https.onRequest(app);

exports.scheduledFunction = functions.pubsub.schedule('00 00 * * 7').timeZone("Europe/Dublin").onRun(async context => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const updateDate = year + "-" + month + "-" + day;

        const snapshot = await db.collection('timetables').doc("default").get();
        let timetable = snapshot.data();
        const newDocument = db.collection('timetables').doc(updateDate).set(timetable);
        return console.log("success");
    } catch (error) {
        return console.log(error.message);
    }
});




