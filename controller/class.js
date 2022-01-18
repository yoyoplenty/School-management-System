const Teacher = require('../models/teacher');
const ClassTeacher = require('../models/class');
const { validationResult } = require('express-validator');
const { validate } = require('../services/code');


exports.createClassTeacher = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    let { school_level, dept, class_name, class_teacher } = req.body
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        let body = req.body
        body.dept = newDept
        req.body = body
        //find teacher id from the given one
        const teacher = await Teacher.findById(class_teacher)
        //find in provided teacher as been 
        let teacherPresent = await ClassTeacher.findOne({ class_teacher: class_teacher })
        let classTeacher = await ClassTeacher.findOne({
            $and: [{ dept: req.body.dept }, { class_name: class_name }]
        });
        if (teacherPresent || classTeacher) {
            return res.status(400).json({ error: "Class Teacher Or Selected Class Already assigned" })
        }
        const AssignedTeacher = new ClassTeacher({
            school_level,
            dept: req.body.dept,
            class_name,
            class_teacher: teacher.id
        })
        await AssignedTeacher.save()
            .then(data => {
                res.status(201).json({ data, success: "Class Teacher Assigned successfully" })
            })
            .catch(err => {
                res.status(400).json({ error: "Unable to save" })
            })
    } catch (error) {
        throw error
    }
}

exports.allClassTeacher = async (req, res) => {
    try {
        let allClassTeacher = await ClassTeacher.find({}).select('school_level , dept , class_name').populate('class_teacher', `firstname lastname email phone`)
        let classteacher = allClassTeacher.map(x => x.class_teacher)
        res.status(200).json({ allClassTeacher })
    } catch (error) {
        throw error
    }
}

exports.eachClassTeacher = async (req, res) => {
    const { school_level, class_name, dept } = req.query
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        const classClassTeacher = await ClassTeacher.findOne({
            $and: [{ school_level }, { dept: newDept }, { class_name }]
        }).select('school_level , dept , class_name').populate('class_teacher', `firstname lastname email phone`)
        if (!classClassTeacher) {
            return res.status(400).json({ error: "Provided Class has not been assigned to a Teacher Yet" })
        }
        res.status(200).json({ classClassTeacher })
    } catch (error) {
        throw error
    }
}

exports.eachLevelClass = async (req, res) => {
    const { school_level } = req.query
    try {
        const levelClassTeachers = await ClassTeacher.find({ school_level }).select('school_level , dept , class_name')
            .populate('class_teacher', `firstname lastname email phone`);
        if (!levelClassTeachers) {
            return res.status(400).json({ error: "No Class Teacher Yet for the Provided Level" })
        }
        res.status(200).json({ levelClassTeachers })
    } catch (error) {
        throw error
    }

}

exports.eachDeptClass = async (req, res) => {
    const { school_level, dept } = req.query
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        const eachDeptClassTeacher = await ClassTeacher.find({
            $and: [{ school_level }, { dept: newDept }]
        }).select('school_level , dept , class_name').populate('class_teacher', `firstname lastname email phone`);
        if (!eachDeptClassTeacher) {
            return res.status(400).json({ error: "Provided School Level has not been assigned  a Class Teacher Yet" })
        }
        res.status(200).json({ eachDeptClassTeacher })
    } catch (error) {
        throw error
    }
}

exports.deleteClassTeacher = async (req, res) => {
    const ID = req.query.id
    try {
        let exactClassTeacher = await ClassTeacher.findById(ID)
        if (!exactClassTeacher) {
            return res.status(400).json({ error: "Class Teacher with the specified ID not present" })
        }
        await ClassTeacher.findByIdAndDelete(ID);
        res.status(200).json({ success: 'Class Teacher Deleted successfully ' })
    } catch (error) {
        throw error
    }
}

exports.editClassTeacher = async (req, res) => {
    const ID = req.query.id
    let { school_level, dept, class_name, class_teacher } = req.body
    let newDept = validate(school_level, dept, () => {
        return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
    })
    try {
        let classteacher = await ClassTeacher.findById(ID)
        if (!classteacher) {
            res.status(400).json({ error: "No Class Teacher Present" })
        }
        const teacherPresent = await ClassTeacher.findOne({ class_teacher });
        if (teacherPresent) {
            res.status(400).json({ error: "Teacher Already assigned, Please select a new teacher" })
        }
        let newClassTeacher = classteacher
        //Set Updated Variables
        newClassTeacher.school_level = school_level
        newClassTeacher.dept = newDept
        newClassTeacher.class_name = class_name
        newClassTeacher.class_teacher = class_teacher
        //Updated
        updatedClassTeacher = await newClassTeacher.save();
        if (!updatedClassTeacher) {
            return res.status(200).json({ error: "Unable to Update Class Teacher" })
        }
        res.status(201).json({ "success": updatedClassTeacher })
    } catch (error) {
        throw error
    }
}