const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Subject = require('../models/subjects');
const Class = require('../models/class')
const { number, validate } = require('../services/code');
const { allData, deleteData, eachData, editUser } = require('../middleware/fn');
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
        res.status(201).json({ teacher, success: `New Teacher ${teacher.fullname} was successfully created` })
    } catch (error) {
        res.status(500).json({ error: "interal server error" })
    }
}

exports.createStudent = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    let { school_level, dept, class_id } = req.body
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        let body = req.body
        let admissionNumber = await number(Student);
        body.admission_number = admissionNumber
        req.body = body
        body.dept = newDept
        req.body = body
        const existingStudent = await Student.findOne({
            $and: [{ school_level: school_level }, { dept: req.body.dept }, { class_id: class_id }]
        })
        if (existingStudent) {
            return res.status(400).json({ error: "Student Already Present" })
        }
        let student = await Student.create(req.body)
        res.status(201).json({ student, success: `Student, ${student.fullname} Successfully Created` })
    } catch (error) {
        res.status(500).json({ error: "interal server error" })
    }
}

exports.allTeachers = async (req, res) => {
    await allData(Teacher, req, res)
}

exports.eachTeacher = async (req, res) => {
    eachData(req.query.id, Teacher, req, res, "Teacher")
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
        res.status(500).json({ error: "interal server error" })
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
        res.status(500).json({ error: "interal server error" })
    }
}

exports.deleteTeacher = async (req, res) => {
    await deleteData(req.query.id, Teacher, req, res, "Teacher")
}

exports.editTeacher = async (req, res) => {
    editUser(req.query.id, Teacher, req, res, "Teacher")
}

exports.allStudents = async (req, res) => {
    await allData(Student, req, res)
}

exports.eachStudent = async (req, res) => {
    eachData(req.query.id, Student, req, res, "Student")
}

exports.eachLevelStudent = async (req, res) => {
    try {
        let { school_level } = req.query
        let eachlevel = await Student.find({ school_level })
        if (!eachlevel) {
            return res.status(400).json({ error: 'No Student available with the provided Level' });
        }
        res.status(200).json(eachlevel)
    } catch (error) {
        res.status(500).json({ error: "interal server error" })
    }
}

exports.eachDept = async (req, res) => {
    try {
        let { school_level, dept } = req.query
        let eachDept = await Student.find({ school_level, dept })
        if (!eachDept || eachDept.length < 1) {
            return res.status(400).json({ error: 'No Student available with the provided Level & Department' });
        }
        res.status(200).json(eachDept)
    } catch (error) {
        res.status(500).json({ error: "interal server error" })
    }
}

exports.classStudent = async (req, res) => {
    try {
        let { school_level, dept, class_name } = req.query
        let eachclass = await Student.find({ school_level, dept, class_name })
        if (!eachclass || eachclass.length < 1) {
            return res.status(400).json({ error: 'No Student available with the provided Level, Department & Class' });
        }
        res.status(200).json(eachclass)
    } catch (error) {
        res.status(500).json({ error: "interal server error" })
    }
}
//Come Back to refactor this code here
exports.editStudent = async (req, res) => {
    editUser(req.query.id, Student, req, res, "Student")
}

exports.deleteStudent = async (req, res) => {
    await deleteData(req.query.id, Student, req, res, "Student")
}

