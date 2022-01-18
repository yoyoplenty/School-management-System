const Admin = require('../models/admin');
const Email = require('../services/mail');
const { validationResult } = require('express-validator');
let utils = require('../services/code');
let generateCode = utils.generateRandomCharacter
const generateAccessToken = require('../services/code').generateAccessToken

exports.getIndex = (req, res) => {
    res.status(200).json({ success: 'Welcome to the Home Page' })
}

exports.registerAdmin = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {
        let confirmationCode = generateCode(25)
        let body = req.body;
        body.firstname = body["fullname"].split(" ")[0];
        body.lastname = body["fullname"].split(" ")[1];
        body.confirmationCode = confirmationCode
        req.body = body;
        const admin = await Admin.create(req.body)
        //Email Body
        let emailBody = `<h1>Email Confirmation</h1>
        <h2>Hello ${admin.fullname}</h2>
        <p>Thank you for Signing Up. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3001/confirmAdmin/${confirmationCode}> Click here</a>
        </div>`;
        let subject = "Admin Profile Created";
        //Send Mail to Confirm Admin's Email
        await Email.sendMail(admin.email, subject, emailBody);
        return res.status(201).json({ successful: 'Registration confirmation sent to the provided email address', })
    } catch (err) {
        throw err
    }
}

exports.confirmAdmin = async (req, res) => {
    console.log(req.params)
    try {
        let admin = await Admin.findOne({ confirmationCode: req.params.confirmationCode })
        if (!admin) {
            return res.status(400).json({ message: "User with the provided confirmation Code Not found." });
        }
        admin.status = "Active";
        admin.save()
        res.status(200).json({ success: "Registration Confirmation Successful, You can now login Successfully", admin })
    } catch (error) {
        throw error
    }
}

exports.loginAdmin = async (req, res) => {
    let { email } = req.body
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {
        let admin = await Admin.findOne({ email })
        //jwt token
        const token = generateAccessToken({ admin })
        req.admin = token
        return res.status(200).json(token);
    } catch (error) {
        throw error
    }
}

exports.forgetPassword = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    let { email } = req.body
    try {
        const admin = await Admin.findOne({ email })
        const reset_token = generateCode(20)
        await Admin.updateOne({ email }, { reset_token });
        //Send Email
        let emailBody = `<h1>Email Confirmation, Passowrd Reset</h1><h2> Hello ${admin.fullname}</h2>
        <p>Your Password Reset Link. Please confirm by clicking on the following link</p>
        <a href=http://localhost:3001/reset/?reset_token=${reset_token}> Click here</a>
        </div>`;
        let subject = "Password Reset"
        await Email.sendMail(admin.email, subject, emailBody);
        res.status(200).json({ "success": "Password reset Link sent successfully to your Email Address" })
    } catch (error) {
        throw error
    }
}

exports.reset = async (req, res) => {
    let { reset_token } = req.query
    const admin = await Admin.findOne({ reset_token })
    res.json(admin)
}

exports.newPassword = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    let { reset_token } = req.query
    try {
        const admin = await Admin.findOne({ reset_token })
        if (!admin) {
            return res.json({ error: 'Reset Token expired' })
        }
        admin.password = req.body.password
        admin.save()
            .then(async err => {
                res.json({ 'success': 'Password reset successful' })
                //  await PasswordReset.deleteOne({ _id: passwordReset._id })
            }).catch(error => {
                res.send('error', 'Failed to reset password please try again')
            })

    } catch (error) {
        throw error
    }
}