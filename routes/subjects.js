const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const subject = require('../controller/subjects');
const { createSubject, createSubjectTeacher } = require('../config/validate')

//Create Subject teachers
router.post('/newsubject', createSubject,/* authenticateToken,*/ subject.createSubject)
router.post('/newsubjectteachers', createSubjectTeacher,/* authenticateToken,*/ subject.createSubjectTeachers)


module.exports = router