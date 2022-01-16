const Teacher = require('../models/teacher');
const ClassTeacher = require('../models/class');
const { validationResult } = require('express-validator');
const { validate } = require('../services/code')


exports.createClassTeacher = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    let { school_level, dept, class_name, class_teacher } = req.body
    try {
        validate(school_level, dept, () => {
            return res.status(400).json({ error: "Department Cannot be undefined for Senior Level" })
        })
        //This validation should be in express validator
        //find teacher id from the given one
        const teacher = await Teacher.findById(class_teacher)
        //find in provided teacher as been 
        let teacherPresent = await ClassTeacher.findOne({ class_teacher: class_teacher })
        let classTeacher = await ClassTeacher.findOne({
            $and: [{ dept: req.body.dept }, { class_name: class_name }]
        });
        console.log(classTeacher)
        if (teacherPresent || classTeacher) {
            return res.status(400).json({ error: "Class Teacher Or Selected Class Already assigned" })
        }
        const AssignedTeacher = new ClassTeacher({
            school_level,
            dept,
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