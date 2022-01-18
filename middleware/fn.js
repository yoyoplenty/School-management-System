exports.allData = async (model, req, res) => {
    try {
        let allDatas = await model.find({})
        res.status(200).json({ allDatas })
    } catch (error) {
        console.log(error)
    }
}

exports.deleteData = async (ID, model, req, res, data) => {
    try {
        let exactUser = await model.findByIdAndDelete(ID);
        if (!exactUser) {
            return res.status(400).json({ error: `${data} with the specified ID not present ` })
        }
        res.status(200).json({ error: `${data} Deleted successfully ` })
    } catch (error) {
        console.log(error)
    }
}

exports.findEachData = async (ID, model) => {
    return await model.findById(ID)
}

exports.eachData = async (ID, model, req, res, data) => {
    try {
        let eachData = await model.findById(ID)
        if (!eachData) {
            return res.status(400).json({ error: `NO ${data} with the ID provided` })
        }
        res.status(200).json(eachData)
    } catch (error) {
        console.log(error)
    }
}

exports.editUser = async (ID, model, req, res, data) => {
    try {
        let editedUser = await model.findByIdAndUpdate(ID, req.body)
        if (!editedUser) {
            return res.status(400).json({ error: `NO ${data} with the ID provided ` })
        }
        res.status(200).json({ editedUser, success: `${data} was Updated Successfully` })
    } catch (error) {
        console.log(error)
    }
}