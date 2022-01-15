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
            type: String,
        }
    ]
}, {
    timestamps: true
});


const Subject = mongoose.model('Subject', subjectSchema)
module.exports = Subject