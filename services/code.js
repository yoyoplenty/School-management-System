const jwt = require('jsonwebtoken');

exports.generateAccessToken = (admin) => {
    return jwt.sign(admin, process.env.TOKEN_SECRET, { expiresIn: '36000s' });
}

exports.generateRandomCharacter = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.number = async (model) => {
    try {
        let noOfStudents = await model.find({}).countDocuments()
        let inc = noOfStudents + 1
        let validNo = ('00' + inc).slice(-3)
        let number = `${new Date().getFullYear()}/${validNo}`
        return number
    } catch (error) {
        throw error
    }
}

exports.validate = (school_level, dept, statement) => {
    if (school_level == 'junior') { dept = undefined }
    else {
        if (dept == undefined) {
            statement()
            dept = req.body.dept
        }
    }
    return dept
}

