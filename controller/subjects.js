const Subject = require('../models/subjects');
const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');
const { deleteData, eachData, } = require('../middleware/fn');
const { validate } = require('../services/code');



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
        console.log(error)
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

exports.allSubjects = async (req, res) => {
    try {
        let allSubjects = await Subject.find({})
        let subject = allSubjects.map(x => x.subject_name)
        res.status(200).json({ subject })
    } catch (error) {
        console.log(error)
    }
};

exports.eachSubject = async (req, res) => {
    eachData(req.query.id, Subject, req, res, "Subject")
}

exports.allSubjectTeachers = async (req, res) => {
    const { subject_name } = req.query
    try {
        const subjectTeachers = await Subject.find({ subject_name }).select('subject_name').populate('subject_teacher', `firstname lastname email phone`);
        if (!subjectTeachers) {
            return res.status(400).json({ error: "No Suubject Teacher for the Selected Subject" })
        }
        res.status(200).json(subjectTeachers)
    } catch (error) {
        console.log(error)
    }
}

exports.eachLevelSubject = async (req, res) => {
    const { school_level } = req.query
    try {
        const eachLevelSubject = await Subject.find({ class_offering_subject: { $elemMatch: { school_level: school_level } } })
        if (!eachLevelSubject) {
            res.status(400).json({ error: "No subject for the Selected level" })
        }
        let subject = eachLevelSubject.map(x => x.subject_name)
        res.status(200).json(subject)
    } catch (error) {
        console.log(error)
    }
}

exports.eachDeptSubject = async (req, res) => {
    const { school_level, dept } = req.query
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        const eachDeptSubject = await Subject.find({ class_offering_subject: { $elemMatch: { school_level: school_level, dept: newDept } } })
        if (!eachDeptSubject || eachDeptSubject.length < 1) {
            return res.status(400).json({ error: "No subject for the Selected level & Department" })
        }
        let subject = eachDeptSubject.map(x => x.subject_name)
        res.status(200).json(subject)
    } catch (error) {
        console.log(error)
    }
}

exports.deleteSubject = async (req, res) => {
    deleteData(req.query.id, Subject, req, res, "Subject")
}

exports.deleteSubjectTeacher = async (req, res) => {
    const { subject_name, id } = req.query
    try {
        const subjectTeacher = await Subject.findOne({
            $and: [{ subject_name }, { subject_teacher: id }]
        });
        if (!subjectTeacher) {
            return res.status(400).json({ error: "Provided Teacher has not been assigned to the provided Subject Yet" })
        }
        await Subject.updateOne({ subject_name }, { $pull: { subject_teacher: id } });
        res.status(200).json({ success: "Subject Teacher Deleted Successfully" })
    } catch (error) {
        console.log(error)
    }
}