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
        res.status(201).json({ teacher, success: `New Teacher ${teacher.fullname} was successfully created` })
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
            return res.status(400).json({ error: "Teacher with the specified ID not present" })
        }
        await Teacher.findByIdAndDelete(ID);
        res.status(200).json({ error: 'Teacher Deleted successfully ' })
    } catch (error) {
        throw error
    }
}

exports.editTeacher = async (req, res) => {
    try {
        const existingTeacher = await Teacher.findById(req.query.id)
        if (!existingTeacher) {
            return res.status(400).json({ error: 'NO Teacher with the ID provided' })
        }
        let editedTeacher = await Teacher.findByIdAndUpdate(req.query.id, req.body)
        res.status(200).json({ editedTeacher, success: "Teacher was Updated Successfully" })
    } catch (error) {
        throw error
    }
}

exports.allStudents = async (req, res) => {
    try {
        let allStudents = await Student.find({})
        res.status(200).json({ allStudents })
    } catch (error) {
        throw error
    }
}

exports.eachStudent = async (req, res) => {
    try {
        let eachStudent = await Student.findById(req.query.id)
        if (!eachStudent) {
            return res.status(400).json({ error: 'NO Student with the ID provided' })
        }
        res.status(200).json(eachStudent)
    } catch (error) {
        throw error
    }
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
        throw error
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
        throw error
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
        throw error
    }
}

exports.editStudent = async (req, res) => {
    try {
        const existingStudent = await Student.findById(req.query.id)
        if (!existingStudent) {
            return res.status(400).json({ error: 'NO Student with the ID provided' })
        }
        let editedStudent = await Student.findByIdAndUpdate(req.query.id, req.body)
        res.status(200).json({ editedStudent, success: "Student was Updated Successfully" })
    } catch (error) {
        throw error
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        let ID = req.query.id
        let exactStudent = await Student.findById(ID)
        if (!exactStudent) {
            return res.status(400).json({ error: "Student with the specified ID not present" })
        }
        await Student.findByIdAndDelete(ID);
        res.status(200).json({ success: 'Student Deleted successfully ' })
    } catch (error) {
        throw error
    }
}

