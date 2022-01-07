const jwt = require("jsonwebtoken");
const connection = require("../services/db.js");
const {findUser} = require("./users");

findAdmin = (req,res) => {
    connection.query("SELECT id FROM users WHERE username = ? AND password = ?",
        [req.body.username, req.body.password],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            if (results.length) {
                console.log("found user: ", results[0].id);
                const accessToken = jwt.sign(results[0].id, process.env.ACCESS_TOKEN_SECRET)
                connection.query("SELECT * FROM roles WHERE userid = ?", [results[0].id],
                    (err, results2) => {
                        if (err) {
                            console.log("error: ", err);
                            return res.status(500).json(err.message);
                        }
                        if (results2[0].roleid == 1)
                            return res.status(200).json({"accessToken": accessToken});
                        else
                            return res.status(401).json({});
                    });
               return;
            }
            return res.status(404).json({});
        });
}

module.exports = {findAdmin};