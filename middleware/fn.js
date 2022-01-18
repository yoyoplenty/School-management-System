exports.allData = async (model, req, res) => {
    try {
        let allDatas = await model.find({})
        res.status(200).json({ allDatas })
    } catch (error) {
        res.status(500).json({ error: "interal server error" })
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
        res.status(500).json({ error: "interal server error" })
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
        res.status(500).json({ error: "interal server error" })
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
        res.status(500).json({ error: "interal server error" })
    }
}
