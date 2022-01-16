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
        //Validation should be done on the
        let exactTeacher = await Teacher.findById(req.body.teacher_id)
        let subjectTeacherPresent = await Subject.findOne({
            $and: [{ subject_name: req.body.subject_name }, { class_offering_subject: req.body.class_offering_subject }, { subject_teacher: exactTeacher._id }]
        })
        console.log(subjectTeacherPresent)
        if (subjectTeacherPresent) {
            return res.status(400).json({ error: "Teacher & Classes Offering Subjects Already Assigned " })
        }
        let subject = await Subject.updateOne({ subject_name: req.body.subject_name }, { $push: { subject_teacher: exactTeacher._id, class_offering_subject: req.body.class_offering_subject } }, { upsert: true })
        res.status(201).json({ subject, success: "Teacher Assigned to this Subject Successfully" })
    } catch (error) {
        throw error
    }
}
