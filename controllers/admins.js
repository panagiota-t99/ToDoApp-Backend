const jwt = require("jsonwebtoken");
const connection = require("../services/db.js");

findAdmin = (req, res) => {
    connection.query("SELECT id FROM users WHERE username = ? AND password = ?", [req.body.username, req.body.password], (err, results) => {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json(err.message);
        }
        if (results.length) {
            console.log("found user: ", results[0].id);
            const accessToken = jwt.sign(results[0].id, process.env.ACCESS_TOKEN_SECRET)
            connection.query("SELECT * FROM roles WHERE userid = ?", [results[0].id], (err, results2) => {
                if (err) {
                    console.log("error: ", err);
                    return res.status(500).json(err.message);
                }
                if (results2[0].roleid == 1) return res.status(200).json({"accessToken": accessToken}); else return res.status(401).json({});
            });
            return;
        }
        return res.status(404).json({});
    });
};

findUserLists = (req, res) => {
    console.log(req.params.userid);
    connection.query("SELECT name, COUNT(*) as count FROM logs WHERE userid = ? AND message LIKE 'User added list%' OR message LIKE 'User edited list%' GROUP BY (name)", [req.params.userid], (err, results) => {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json(err.message);
        }
        console.log(results)
        return res.status(200).json(results);
    });
};


findUserListItems = (req, res) => {
    var m1 = 'User added item%' + req.params.listname + '%';
    var m2 = 'User edited item%' + req.params.listname + '%';
    connection.query("SELECT name, COUNT(*) as count FROM logs WHERE userid = ? AND message LIKE ?  OR message LIKE ? GROUP BY (name)", [req.params.userid,m1,m2], (err, results) => {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json(err.message);
        }
        console.log(results)
        return res.status(200).json(results);
    });
};



module.exports = {findAdmin, findUserLists, findUserListItems};