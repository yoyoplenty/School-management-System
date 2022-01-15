const express = require('express')
const router = express.Router()
const classteacher = require('../controller/class')


router.post('/newclass', classteacher.createClassTeacher)


module.exports = router