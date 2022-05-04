const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const serviceAccount = require('./attendancetracker-a53a9-firebase-adminsdk-9lkrx-6c1c4efdfd.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
}
);
const app = express();
app.use(cors());
const db = admin.firestore();
const fcm = admin.messaging();

// const getMessaging = require('firebase/messaging/sw')
// const FCM = require('fcm-node');
// const serverKey = 'AAAAViCbxF4:APA91bE21QG3Esq3h8HEEd8dQ0UyjGKBlI6A5-yhJPodJXsb9vPHowkcz2Q0Eh4cTZhjoU9jTRUcUcXaEecJFO1D3geelMEwrmRctvHHItcm3GPQJVYhU3Kfr_Nkp1BpLFsSoI1LSy7T' //put your server key here

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

// get student module
app.get('/getStudentModuleList', async (req, res) => {
    try {
        const snapshot = await db.collection('students').get();
        let student = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            student.push({ id, data });
        });

        const snapshot2 = await db.collection('courses').get();
        snapshot2.forEach(doc => {
            for (let i = 0; i < student.length; i++) {
                if (student[i].data.CourseID == doc.id) {
                    student[i].data.CourseID = doc.data().moduleList;
                }
            }
        })
        res.status(200).send(student);
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

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
app.get('/courses', async (req, res) => {
    try {
        const snapshot = await db.collection('courses').get();
        let course = [];
        snapshot.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            course.push({ id, data });
        });
        res.status(200).send(course);
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

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
        res.status(200).send("Success");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//add new students
app.post('/students', async (req, res) => {
    try {
        const student = req.body;
        const id = student.id;
        const result = JSON.parse(student.field);
        await db.collection('students').doc(id).set(result);
        res.status(200).send("Success");
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
        res.status(200).send("Success");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.get('/notificationToken/:userid', async (req, res) => {
    try {
        let token;
        const snapshot = await db.collection('notificationToken').where('userID', '==', req.params.userid).get();
        snapshot.forEach((res) => {
            token = { token: res.data().token, userID: res.data().userID }
        })
        console.log(token)
        res.status(200).send(token);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//get all classes
app.get('/classes', async (req, res) => {
    try {
        const snapshot = await db.collection('classes').get();
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

app.patch('/:role/:id', async (req, res) => {
    try {
        const document = db.collection(req.params.role).doc(req.params.id);
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
app.post('/timetables/:date/:class_id', async (req, res) => {
    try {
        const snapshot = db.collection('timetables').doc(req.params.date);
        const getData = await snapshot.get();
        let result = getData.data();
        let students = [];
        let timetable = result.timetable;
        for (let res of timetable) {
            if (res.class_id == req.params.class_id && res.active != false) {
                res.active = false;
                students = res.students;
                break;
            }
        }

        if (students.length > 0) {
            let newClassId;
            delete req.body.newClass.module_name;
            await db.collection('classes').add(req.body.newClass).then(function (res) {
                newClassId = res.id;
            })
            let newRecordTimetable = {
                students: students,
                active: true,
                class_id: newClassId
            }
            timetable.push(newRecordTimetable);
            result.timetable = timetable;
            await snapshot.set(result);

            const courses = await db.collection('courses').get();
            let topic;
            courses.forEach(doc => {
                let data = doc.data();
                for (let i = 0; i < data.moduleList.length; i++) {
                    if (data.moduleList[i] == req.body.newClass.module_id) {
                        topic = data.name
                    }
                }
            });
            console.log(topic)
            let message;
            if (req.params.date == "default") {
                message = {
                    notification: {
                        title: `Timetable changes for Semester`,
                        body: `Module : ${req.body.newClass.module_name} \n Day : ${req.body.newClass.day} \n Time : ${req.body.newClass.start_time} - ${req.body.newClass.end_time} \n Classroom : ${req.body.newClass.classroom}`
                    },
                };
            } else {
                message = {
                    notification: {
                        title: `Timetable changes for Week -  ${req.params.date}`,
                        body: `Module : ${topic} \n Day : ${req.body.newClass.timeslot.day} \n Time : ${req.body.newClass.timeslot.start_time} - ${req.body.newClass.timeslot.end_time} \n Classroom : ${req.body.newClass.timeslot.classroom}`
                    },
                };
            }
            sendNotification(topic.replace(/\s/g, ''), message);
            return res.status(200).send();
        }

        return res.status(500).send("Data not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }

});

function sendNotification(topic, message) {
    return admin.messaging().sendToTopic(topic, message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}


exports.api = functions.runWith({ minInstances: 1 }).https.onRequest(app);

const updateAttendance = require('./attendanceFunction');
exports.updateAttendance = updateAttendance.attendanceFunctions;

exports.scheduledFunction = functions.pubsub.schedule('00 01 * * 0').timeZone("Europe/Dublin").onRun(async context => {
    try {
        const today = new Date();
        // Get last sunday date
        const lastSunday = today.getDate() - today.getDay();
        let sunday = new Date(today.setDate(lastSunday));
        // gettimezoneoffset
        const final = sunday.setTime(
            sunday.getTime() - new Date().getTimezoneOffset() * 60 * 1000
        );
        const result = new Date(final).toJSON();
        const dateOnly = result.split('T');
        const date = dateOnly[0];
        const snapshot = await db.collection('timetables').doc("default").get();
        let timetable = snapshot.data();
        const newDocument = db.collection('timetables').doc(date).set(timetable);
        return console.log("success");
    } catch (error) {
        return console.log(error.message);
    }
});



