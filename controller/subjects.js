const Subject = require('../models/subjects');
const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');


exports.createSubject = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {
        //Validation should be done on the
        let subjectPresent = await Subject.findOne({
            $and: [{ subject_name: req.body.subject_name },
            { class_offering_subject: { $elemMatch: { school_level: req.body.school_level, dept: req.body.dept } } }]
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
