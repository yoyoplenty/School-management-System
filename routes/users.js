const express = require('express')
const router = express.Router();
const users = require('../controller/users');
const { authenticateToken } = require('../middleware/auth')
const { createStudent, createTeacher } = require('../config/usersvalidate');
const { route } = require('express/lib/application');

//Create Teacher
router.post('/newteacher', authenticateToken, createTeacher, users.createTeacher)
router.post('/newstudent', /*authenticateToken,*/ createStudent, users.createStudent)
//Get all Teacher
router.get('/allteachers', users.allTeachers)
//Get Each Teacher
router.get('/eachteacher/', users.eachTeacher)
//Get each teachers subject
router.get('/teachersubject', users.eachTeacherSubject);
//Get Class teacher was assigned To
router.get('/classassigned', users.classAssigned)
//Delete Teacher
router.delete('/deleteteacher', users.deleteTeacher)

module.exports = router 