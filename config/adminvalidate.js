const { body, check } = require('express-validator');
const bcrypt = require("bcryptjs");
const Admin = require('../models/admin')

const registerValidation = [
    check('fullname').notEmpty().withMessage("Full name is required!"),
    body("email").normalizeEmail().notEmpty().withMessage("Email is required!").isEmail().withMessage("Enter a valid email!")
        .custom(async value => {
            await Admin.findOne({ email: value }).then(admin => {
                if (admin) {
                    throw new Error("E-mail already in use.")
                }
            })
        }),
    check('work_level').notEmpty().isLength({ max: 2 }).withMessage('Work level should not exceed 2 characters'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage("Password should be more than 6 characters long").custom(async (value, { req }) => {
        if (value !== req.body.password2) {
            throw new Error("Passwords do not match")
        }
    })
];

const loginValidation = [
    check("email").notEmpty().withMessage("email is required").exists().isEmail().normalizeEmail().custom(async value => {
        await Admin.findOne({ email: value })
            .then(admin => {
                if (!admin) {
                    throw new Error("Admin does not exist")
                }
            })
    }).custom(async value => {
        await Admin.findOne({ email: value })
            .then(admin => {
                if (admin.status === 'Pending') {
                    throw new Error("Admin's account is not verified! Go to your mail and click the link to verify account.")
                }
            })
    }),
    body("password").notEmpty().isLength({ min: 5 }).withMessage('Password must be a minimum of 5 characters')
        .custom(async (value, { req }) => {
            await Admin.findOne({ email: req.body.email })
                .then(async admin => {
                    await bcrypt.compare(value, admin.password)
                        .then(res => {
                            if (res === false) {
                                throw new Error("Incorrect password.")
                            }
                        })
                })
        })
]

const forgotPasswordValidation = [
    check("email").notEmpty().custom(async (value) => {
        await Admin.findOne({ email: value })
            .then(admin => {
                if (!admin) {
                    throw new Error("User not registered!")
                }
            })
    })
]
const resetPasswordValidation = [
    check("password").notEmpty().withMessage("Enter password!").isLength({ min: 6 }).withMessage("Password must be up to 6 characters long.")
        .custom(async (value, { req }) => {
            if (value !== req.body.password2) {
                throw new Error("Passwords do not match!")
            }
        }),
]





module.exports = {
    registerValidation, loginValidation, forgotPasswordValidation,
    resetPasswordValidation
};