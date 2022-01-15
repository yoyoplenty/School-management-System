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
        enum: ['male', 'female']
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
    registration_number: {
        type: String,
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
