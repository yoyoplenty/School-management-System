const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    work_level: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    reset_token: {
        type: String
    }
}, {
    timestamps: true
});

adminSchema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`
})
// encrypt the password using 'bcryptjs'
adminSchema.pre('save', async function hashPassword(next) {
    try {
        const admin = this;
        // only hash the password if it has been modified (or is new)
        if (!admin.isModified('password')) return next();
        // generate a salt
        const salt = await bcrypt.genSalt(10);
        // hash the password along with our new salt
        const hash = await bcrypt.hash(admin.password, salt);
        // override the cleartext password with the hashed one
        admin.password = hash;
        return next();
    } catch (e) {
        return next(e);
    }
});

// This is Instance Method that is gonna be available on all documents in a certain collection
adminSchema.methods.correctPassword = async function (typedPassword, originalPassword) {
    return await bcrypt.compare(typedPassword, originalPassword);
};


const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin