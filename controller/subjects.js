const Subject = require('../models/subjects');
const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');
const { validate } = require('../services/code')


exports.createSubject = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    let { school_level, dept, subject_name } = req.body
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        let body = req.body
        body.dept = newDept
        req.body = body
        let subjectPresent = await Subject.findOne({
            $and: [{ subject_name: subject_name },
            { class_offering_subject: { $elemMatch: { school_level: school_level, dept: dept } } }]
        })
        if (subjectPresent) {
            return res.status(400).json({ error: "Subjects to Department Already Assigned " })
        }
        let subject = await Subject.updateOne({ subject_name: req.body.subject_name }, {
            $push:
            {
                class_offering_subject: {
                    school_level: req.body.school_level,
                    dept: req.body.dept
                }
            }
        },
            { upsert: true })
        res.status(201).json({ subject, success: "Subject assigned Successfully" })
    } catch (error) {
        throw error
    }
}

exports.createSubjectTeachers = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {
        let exactTeacher = await Teacher.findById(req.body.teacher_id)
        let subjectTeacherPresent = await Subject.findOne({
            $and: [{ subject_name: req.body.subject_name }, { subject_teacher: exactTeacher._id }]
        })
        if (subjectTeacherPresent) {
            return res.status(400).json({ error: "Teacher to Subject Already Assigned " })
        }

        let subject = await Subject.updateOne({ subject_name: req.body.subject_name }, {
            $push:
            {
                subject_teacher: exactTeacher._id,

            }
        },
            { upsert: true })
        res.status(201).json({ subject, success: "Teacher Assigned to this Subject Successfully" })
    } catch (error) {

    }
}
