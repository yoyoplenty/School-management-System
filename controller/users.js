const Teacher = require('../models/teacher');
const Student = require('../models/student');
const { number, validate } = require('../services/code');
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
        let { school_level, dept, class_id } = req.body
        let body = req.body
        let admissionNumber = await number(Student);
        body.admission_number = admissionNumber
        req.body = body
        validate(school_level, dept, () => {
            return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
        })
        const existingStudent = await Student.findOne({
            $and: [{ school_level: school_level }, { dept: dept }, { class_id: class_id }]
        })
        if (existingStudent) {
            return res.status(400).json({ error: "Student Already Present" })
        }
        const student = await Student.create(req.body)
        res.status(201).json({ student, success: `Student, ${student.fullname} Successfully Created` })
    } catch (error) {
        throw error
    }
}