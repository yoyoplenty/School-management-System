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


/* let noOfStudents = await Student.find({}).countDocuments()
        let inc = noOfStudents + 1
        let validNo = ('00' + inc).slice(-3)
        let number = `${new Date().getFullYear()}/${validNo}` */