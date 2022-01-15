const express = require('express')
const router = express.Router();
const users = require('../controller/users');
const { authenticateToken } = require('../middleware/auth')
const { createStudent, createTeacher } = require('../config/usersvalidate')

//Create Teacher
router.post('/newteacher', authenticateToken, createTeacher, users.createTeacher)
router.post('/newstudent', authenticateToken, createStudent, users.createStudent)


module.exports = router