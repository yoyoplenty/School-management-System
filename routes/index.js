const express = require('express')
const router = express.Router()
const index = require('../controller/index')
const { registerValidation, loginValidation, forgotPasswordValidation,
    resetPasswordValidation } = require('../config/adminvalidate')


router.get('/', index.getIndex)
//Register Admin
router.post('/register', registerValidation, index.registerAdmin)
router.get('/confirmAdmin/:confirmationCode', index.confirmAdmin)
//Login Admin
router.post('/login', loginValidation, index.loginAdmin)
//Password 


module.exports = router