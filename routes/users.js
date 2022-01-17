const express = require('express')
const router = express.Router();
const users = require('../controller/users');
const { authenticateToken } = require('../middleware/auth')
const { createStudent, createTeacher } = require('../config/usersvalidate');

//Create Teacher
router.post('/newteacher', authenticateToken, createTeacher, users.createTeacher)
//Get all Teacher
router.get('/allteachers', users.allTeachers);
//Get Each Teacher
router.get('/eachteacher', users.eachTeacher);
//Get each teachers subject
router.get('/teachersubject', users.eachTeacherSubject);
//Get Class teacher was assigned To
router.get('/classassigned', users.classAssigned);
//Delete Teacher
router.delete('/deleteteacher', users.deleteTeacher);

//Create Student
router.post('/newstudent', /*authenticateToken,*/ createStudent, users.createStudent)
//Update Student Info
router.put('/editstudent', users.editStudent)
//Get All Student
router.get('/allstudents', users.allStudents);
//Get Each Student
router.get('/eachstudent', users.eachStudent);
//Get Each Level Student
router.get('/eachlevel', users.eachLevelStudent);
//Get Each Department Student
router.get('/eachdepartment', users.eachDept);
//Get each Class Student
router.get('eachclass', users.classStudent)


module.exports = router 