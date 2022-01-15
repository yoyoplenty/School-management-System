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
