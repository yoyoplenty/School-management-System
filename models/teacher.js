const mongoose = require('mongoose');


const teacherSchema = new mongoose.Schema({
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
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        require: true
    },
    date_of_employment: {
        type: String,
        required: true

    },
    date_of_termination: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

teacherSchema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`
})

const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher
