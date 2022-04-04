const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const attendanceApp = express();
attendanceApp.use(cors());
const db = admin.firestore();

//update attendance
attendanceApp.get('/updateTimetables/:date/:class_id/:student_id', async (req, res) => {
    try {
        const snapshot = db.collection('timetables').doc(req.params.date);

        const getData = await snapshot.get();
        let result = getData.data();
        let timetable = result.timetable;
        for (let res of timetable) {
            if (res.class_id == req.params.class_id && res.active == true) {
                for (let student of res.students) {
                    console.log(student.student_id)
                    if (student.student_id == req.params.student_id) {
                        student.attendance = true;
                        break;
                    }
                }
            }

        }
        await snapshot.set(result, { merge: true });
        return res.status(200).send();
    } catch (error) {
        return res.status(500).send(error.message);
    }

});

// get student overall attendance
attendanceApp.get('/timetables/attendance/:student_id', async (req, res) => {
    try {
        const snapshot = db.collection('timetables');
        const getData = await snapshot.get();
        let timetables = [];
        getData.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            timetables.push({ id, data });
        });
        let count = 0;
        let classCount = 0;
        for (let week of timetables) {
            if (week.id != "default") {
                for (let studentList of week.data.timetable) {
                    for (let student of studentList.students) {
                        if (student.student_id == req.params.student_id) {
                            classCount++;
                        }
                        if (student.student_id == req.params.student_id && student.attendance == true) {
                            count++;
                        }
                    }
                }
            }
        }
        let percentage = (count / classCount) * 100;
        return res.status(200).send(percentage.toFixed(2));
    } catch (error) {
        return res.status(500).send(error.message);
    }

});

// get student attendance by id and module
attendanceApp.get('/timetables/attendance/:student_id/:module_id', async (req, res) => {
    try {
        const snapshot = db.collection('timetables');
        const getData = await snapshot.get();
        let timetables = [];
        getData.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            timetables.push({ id, data });
        });
        const getModule = await db.collection('classes').get();
        let classes = [];
        getModule.forEach((doc) => {
            if (doc.data().module_id == req.params.module_id) {
                classes.push(doc.id);
            }
        })
        let count = 0;
        let classCount = 0;
        for (let week of timetables) {
            if (week.id != "default") {
                for (let studentList of week.data.timetable) {
                    for (let i = 0; i < classes.length; i++) {
                        if (studentList.class_id == classes[i]) {
                            for (let student of studentList.students) {
                                if (student.student_id == req.params.student_id) {
                                    classCount++;
                                }
                                if (student.student_id == req.params.student_id && student.attendance == true) {
                                    count++;
                                }
                            }
                        }

                    }
                }
            }
        }

        let percentage = (count / classCount) * 100;
        return res.status(200).send(percentage.toFixed(2));
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

attendanceApp.get('/timetables/weekly/attendance/:student_id/:week', async (req, res) => {
    try {
        const snapshot = db.collection('timetables');
        const getData = await snapshot.get();
        let timetables = [];
        getData.forEach(doc => {
            let id = doc.id;
            let data = doc.data();
            timetables.push({ id, data });
        });
        const getModule = await db.collection('classes').get();
        let classes = [];
        getModule.forEach((doc) => {
            if (doc.data().module_id == req.params.module_id) {
                classes.push(doc.id);
            }
        })
        let count = 0;
        let classCount = 0;
        for (let week of timetables) {
            if (week.id == req.params.week) {
                for (let studentList of week.data.timetable) {
                    for (let student of studentList.students) {
                        if (student.student_id == req.params.student_id) {
                            classCount++;
                        }
                        if (student.student_id == req.params.student_id && student.attendance == true) {
                            count++;
                        }
                    }
                }
            }
        }
        console.log(classCount)
        console.log(count)
        let percentage = (count / classCount) * 100;
        return res.status(200).send(percentage.toFixed(2));
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

exports.attendanceFunctions = functions.runWith({ minInstances: 0 }).https.onRequest(attendanceApp);