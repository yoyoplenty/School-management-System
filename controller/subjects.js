const Subject = require('../models/subjects');
const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');


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
            return res.status(400).json({ error: "Teacher already assigned to this Subject" })
        }
        await Subject.updateOne({ subject_name: req.body.subject_name }, { $push: { subject_teacher: exactTeacher._id } }, { upsert: true })
        res.status(201).json({ success: "Teacher Assigned to this Subject Successfully" })
    } catch (error) {
        throw error
    }
}


