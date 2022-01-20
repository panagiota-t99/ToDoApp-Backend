const connection = require("../services/db.js");

getLogs = (req, res) => {
    console.log(req.params);
    if (req.params.user == 1) {
        connection.query("SELECT * FROM logs_view ORDER BY dateCreated DESC", (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
    } else
        connection.query("SELECT * FROM logs_view WHERE userid = ? ORDER BY dateCreated DESC", [req.id], (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });

};

module.exports = {getLogs};
