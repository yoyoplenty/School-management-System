const { body, oneOf, check } = require('express-validator');

const createSubject = [
    check('subject_name').notEmpty().withMessage("Subject name is required!"),
    oneOf([
        check('school_level').isIn(['junior', 'senior',]),
    ], "Invalid School level"),
]
const createSubjectTeacher = [
    check('teacher_id').notEmpty().withMessage("Teacher ID is required!").isLength({ min: 24, max: 24 }).withMessage("Teachers ID should be 24 Characters long"),
    check('subject_name').notEmpty().withMessage("Subject name is required!"),
]

module.exports = {
    createSubject, createSubjectTeacher
}