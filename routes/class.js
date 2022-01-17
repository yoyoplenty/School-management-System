const express = require('express')
const router = express.Router()
const classteacher = require('../controller/class')
const { createClassTeacher } = require('../config/validate')

//Create Class Teacher
router.post('/newclass', createClassTeacher, classteacher.createClassTeacher);
//Get All class teachers
router.get('/all', classteacher.allClassTeacher)
//Get eat class Class teacher
router.get('/eachclass', classteacher.eachClassTeacher)
//Get each Level Class Teachers
router.get('/eachlevelclass', classteacher.eachLevelClass)
//GET Each department class Teachers
router.get('/eachdept', classteacher.eachDeptClass)


module.exports = router