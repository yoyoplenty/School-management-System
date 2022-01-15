const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const subject = require('../controller/subjects');

//Create Subject teachers
router.post('/newsubject', authenticateToken, subject.createSubjectTeachers)


module.exports = router