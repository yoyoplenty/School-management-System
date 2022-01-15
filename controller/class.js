const Teacher = require('../models/teacher');
const Class = require('../models/class');
const { validationResult } = require('express-validator');


exports.createClassTeacher = async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error = result.array()[0].msg
        return res.status(400).json({ errors: error });
    }
    try {

    } catch (error) {

    }
}