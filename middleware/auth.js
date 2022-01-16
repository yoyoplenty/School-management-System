const jwt = require('jsonwebtoken');


exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ error: "Unauthorized, You do not have access " })

    jwt.verify(token, process.env.TOKEN_SECRET, (err, admin) => {
        console.log(err)
        if (err) return res.status(403).json({ error: "Token Expired, Please Login" })
        req.admin = admin
        next()
    })
}
