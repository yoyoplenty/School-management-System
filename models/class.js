const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    school_level: {
        type: String,
        enum: ['junior', 'senior'],
        required: true
    },
    dept: {
        type: String,
        enum: ['science', 'commercial', 'art']
    },
    class_name: {
        type: String,
        required: true
    },
    class_teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, {
    timestamps: true
});

const ClassTeacher = mongoose.model('ClassTeacher', classSchema)
module.exports = ClassTeacher