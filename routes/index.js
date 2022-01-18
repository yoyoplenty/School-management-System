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
//Forget Password
router.post('/forgetpassword', forgotPasswordValidation, index.forgetPassword)
router.get('/reset', index.reset)
router.post('/reset', resetPasswordValidation, index.newPassword)


module.exports = router