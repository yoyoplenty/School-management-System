const { body, oneOf, check } = require('express-validator');
const Student = require('../models/student')

const createTeacher = [
    check('firstname').notEmpty().withMessage("First name is required!"),
    check('lastname').notEmpty().withMessage("Last name is required!"),
    body('gender').notEmpty().withMessage("Gender is required!"),
    oneOf([
        check('gender').isIn(['male', 'female',]),
    ], "Invalid Gender"),
    body("email").normalizeEmail().notEmpty().withMessage("Email is required!").isEmail().withMessage("Enter a valid email!"),
    check('address').notEmpty().withMessage("Address is required!"),
    check('phone').notEmpty().withMessage("Mobile number is required!").isMobilePhone("any"),
    check('date_of_employment').notEmpty().withMessage("Date of employment is required!"),
    check('date_of_termination').notEmpty().withMessage("Date of termination is required!"),
]


const createStudent = [
    check('firstname').notEmpty().withMessage("First name is required!"),
    check('lastname').notEmpty().withMessage("Last name is required!"),
    body('gender').notEmpty().withMessage("Gender is required!"),
    oneOf([
        check('gender').isIn(['male', 'female',]),
    ], "Invalid Gender"),
    oneOf([
        check('school_level').isIn(['junior', 'senior',]),
    ], "Invalid School level"),
    check('class_id').notEmpty().withMessage('Class identification number required').isLength({ min: 6, max: 6 }).withMessage("Class ID should be 6 Characters"),
    check('address').notEmpty().withMessage("Address is required!"),
    check('parents_name').notEmpty().withMessage("Parent's name is required!"),
    check('parents_phone').notEmpty().withMessage("Mobile number is required!").isMobilePhone("any"),
    check('admission_date').notEmpty().withMessage("Date of Admission is required!"),
    // check('admission_number').notEmpty()isLength({ min: 6 })..withMessage("Admission Number is required!"),
]

module.exports = {
    createStudent, createTeacher
}