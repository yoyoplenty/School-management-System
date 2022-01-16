const { oneOf, check } = require('express-validator');

const createSubject = [
    check('subject_name').notEmpty().withMessage("Subject name is required!"),
    oneOf([
        check('school_level').isIn(['junior', 'senior',]),
    ], "Invalid School level"),
]
const createSubjectTeacher = [
    check('teacher_id').notEmpty().withMessage("Teacher ID is required!")
        .isLength({ min: 24, max: 24 }).withMessage("Teachers ID should be 24 Characters long"),
    check('subject_name').notEmpty().withMessage("Subject name is required!"),
]

const createClassTeacher = [
    oneOf([
        check('school_level').isIn(['junior', 'senior',]),
    ], "Invalid School level"),
    check('class_teacher').notEmpty().withMessage("Teacher ID is required!").
        isLength({ min: 24, max: 24 }).withMessage("Teachers ID should be 24 Characters long"),
    check('class_name').notEmpty().withMessage("Teacher ID is required!")
        .isLength({ min: 4, max: 4 }).withMessage("Teachers ID should be 4 Characters long"),
]


module.exports = {
    createSubject, createSubjectTeacher, createClassTeacher
}