const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Subject = require('../models/subjects');
const Class = require('../models/class')
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

exports.allTeachers = async (req, res) => {
    try {
        let allTeachers = await Teacher.find({})
        res.status(200).json({ allTeachers })
    } catch (error) {
        throw error
    }
}

exports.eachTeacher = async (req, res) => {
    try {
        let eachTeacher = await Teacher.findById(req.query.id)
        console.log(eachTeacher)
        if (!eachTeacher) {
            return res.status(400).json({ error: 'NO teacher with the ID provided' })
        }
        res.status(200).json(eachTeacher)
    } catch (error) {
        throw error
    }
}

exports.eachTeacherSubject = async (req, res) => {
    try {
        const teacherSubjects = await Subject.find({ subject_teacher: req.query.id })
        if (!teacherSubjects) {
            return res.status(400).json({ error: 'No Subject assigned to specified Teacher ID' })
        }
        let subject = teacherSubjects.map(x => x.subject_name)
        res.status(200).json(subject)
    } catch (error) {
        throw error
    }
}

exports.classAssigned = async (req, res) => {
    try {
        const classAssigned = await Class.findOne({ class_teacher: req.query.id })
        if (!classAssigned) {
            return res.status(400).json({ error: 'No Class assigned to specified Teacher ID' })
        }
        res.status(200).json(classAssigned)
    } catch (error) {
        throw error
    }
}
exports.deleteTeacher = async (req, res) => {
    try {
        let ID = req.query.id
        let exactTeacher = await Teacher.findById(ID)
        if (!exactTeacher) {
            return res.status(400).send("Teacher with the specified ID not present")
        }
        await Teacher.findByIdAndDelete(ID);
        res.status(200).send('Teacher Deleted successfully ')
    } catch (error) {
        throw error
    }
}