const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject_name: {
        type: String,
        required: true
    },
    subject_teacher: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        }
    ],
    class_offering_subject: [
        {
            school_level: {
                type: String,
                enum: ['junior', 'senior'],
                required: true
            },
            dept: {
                type: String,
                enum: ['science', 'commercial', 'art'],
            },
        }
    ]
}, {
    timestamps: true
});


const Subject = mongoose.model('Subject', subjectSchema)
module.exports = Subject