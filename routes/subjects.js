const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const subject = require('../controller/subjects');
const { createSubject, createSubjectTeacher } = require('../config/validate')

//Create Subject 
router.post('/newsubject', createSubject, subject.createSubject)
//Create Subject Teachers
router.post('/newsubjectteachers', createSubjectTeacher, subject.createSubjectTeachers)
//Get all Subject
router.get('/all', subject.allSubjects)
//Get all Subject Teachers
router.get('/allsubjectteachers', subject.allSubjectTeachers);
//Get each level Subjects
router.get('/eachlevelsubject', subject.eachLevelSubject);
//Get each Department Subjects
router.get('/eachdeptsubject', subject.eachDeptSubject);
//Delete Subjects 
router.delete('/delete', subject.deleteSubject);
//Delete Subject Teacher
router.delete('/delete/eachteacher', subject.deleteSubjectTeacher)


module.exports = router