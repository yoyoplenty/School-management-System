exports.getbyMail = async (model, email) => {
    return await model.findOne({ email })
}

exports.allUser = async (model, req, res) => {
    try {
        let allUsers = await model.find({})
        res.status(200).json({ allUsers })
    } catch (error) {
        console.log(error)
    }
}

exports.deleteUser = async (ID, model, req, res, user) => {
    try {
        let exactUser = await model.findByIdAndDelete(ID);
        if (!exactUser) {
            return res.status(400).json({ error: `${user} with the specified ID not present ` })
        }
        res.status(200).json({ error: `${user} Deleted successfully ` })
    } catch (error) {
        console.log(error)
    }
}

exports.findEachUser = async (ID, model) => {
    return await model.findById(ID)
}

exports.eachUser = async (ID, model, req, res, user) => {
    try {
        let eachUser = await model.findById(ID)
        if (!eachUser) {
            return res.status(400).json({ error: `NO ${user} with the ID provided` })
        }
        res.status(200).json(eachUser)
    } catch (error) {
        console.log(error)
    }
}

exports.editUser = async (ID, model, req, res, user) => {
    try {
        let editedUser = await model.findByIdAndUpdate(ID, req.body)
        if (!editedUser) {
            return res.status(400).json({ error: `NO ${user} with the ID provided ` })
        }
        res.status(200).json({ editedUser, success: `${user} was Updated Successfully` })
    } catch (error) {
        console.log(error)
    }
}