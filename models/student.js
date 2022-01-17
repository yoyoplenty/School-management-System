const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
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
    },
    class_id: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    parents_name: {
        type: String,
        required: true
    },
    parents_phone: {
        type: String,
        required: true
    },
    admission_number: {
        type: String,
        required: true
    },
    admission_date: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


studentSchema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`
})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student
