const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    /*
    if (token === null)
        return res.sendStatus(401);*/

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, null, (err, id) => {
        if (err)
            return res.sendStatus(401);
        req.id = id;
        console.log("verified", id);
        return next();
    });
}

module.exports = verifyToken;