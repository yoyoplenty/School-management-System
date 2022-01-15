const Teacher = require('../models/teacher');
const Student = require('../models/student');
const { validationResult } = require('express-validator');


exports.createTeacher = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {
        const existingTeacher = await Teacher.findOne({ email: req.body.email })
        if (existingTeacher) {
            return res.status(400).json({ error: "Teacher Already Present" })
        }
        const teacher = await Teacher.create(req.body)
        res.status(201).json({ success: `New Teacher ${teacher.fullname} was successfully created` })
    } catch (error) {
        throw error
    }
}

exports.createStudent = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {
        const existingStudent = await Student.findOne({ admission_number: req.body.admission_number })
        if (existingStudent) {
            return res.status(400).json({ error: "Student Already Present" })
        }
        const student = await Student.create(req.body)
        res.status(201).json({ success: `Student, ${student.fullname} Successfully Created` })
    } catch (error) {
        throw error
    }
}