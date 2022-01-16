const express = require('express')
const router = express.Router()
const classteacher = require('../controller/class')
const { createClassTeacher } = require('../config/validate')


router.post('/newclass', createClassTeacher, classteacher.createClassTeacher)


module.exports = router