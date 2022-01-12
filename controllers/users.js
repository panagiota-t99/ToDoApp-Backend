const jwt = require("jsonwebtoken");
const connection = require("../services/db.js");

findUser = (req, res) => {
    connection.query("SELECT id FROM users WHERE username = ? AND password = ?",
        [req.body.username, req.body.password],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            if (results.length) {
                console.log("found user: ", results[0].id);
                const accessToken = jwt.sign(results[0].id, process.env.ACCESS_TOKEN_SECRET);
                return res.status(200).json({"accessToken": accessToken});
            }
            return res.status(404).json({"message": "User not found!"});
        });
};

findAllLists = (req, res) => {
    connection.query("SELECT listid,listname,dateCreated,dateModified FROM todolists WHERE userid = ?",
        [req.id],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
};

findRole = (req, res) => {
    connection.query("SELECT * FROM roles WHERE userid = ?", [req.id],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
}

findAllUsers = (req, res) => {
    connection.query("SELECT * FROM users_data",
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
}

addUser = (req, res) => {
    var registeredId, roleid;

    connection.query("INSERT INTO users (firstname, lastname, email, username, password) VALUES (?,?,?,?,?)",
        [req.body.fname, req.body.lname, req.body.email, req.body.username, req.body.password],
        (err, results) => {
            if (err) {
                let x = err.message.split(' ').pop().slice(1, -1);
                return res.status(500).json({error: "Field: " + x + " already exists. Cannot register."});
            }
            console.log("registered", results.insertId);
            registeredId = results.insertId;
            const accessToken = jwt.sign(results.insertId, process.env.ACCESS_TOKEN_SECRET);

            connection.query("SELECT * FROM users",
                (err, results1) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }

                    if (results1.length === 1)
                        roleid = 1;
                    else
                        roleid = 2;
                    console.log(roleid);

                    connection.query("INSERT INTO roles (roleid,userid) VALUES (?,?)",
                        [roleid, registeredId],
                        (err, results2) => {
                            console.log("roles");
                            if (err) {
                                console.log("error: ", err);
                                return res.status(500).json(err.message);
                            }
                            return;
                        });

                    return;
                });
            return res.status(200).json({accessToken: accessToken});
        });
}


updateUser = (req, res) => {
    console.log(req.body);
    connection.query("UPDATE users SET firstname = ?, lastname = ?, email = ?, username = ? WHERE id = ?",
        [req.body.firstname, req.body.lastname, req.body.email, req.body.username, req.body.userid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }

            connection.query("UPDATE roles SET roleid = ? WHERE userid = ?",
                [req.body.roleid, req.body.userid],
                (err, results) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }


                    return;
                });
            return res.status(200).json(results);
        });
};

deleteUser = (req, res) => {
    var user = req.params.id;
    connection.query("DELETE FROM users WHERE id = ?",
        [user],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            } else
                connection.query("DELETE todolists,todoitems FROM todolists INNER JOIN todoitems ON todoitems.listid = todolists.listid WHERE todolists.userid = ?",
                    [user],
                    (err, results1) => {
                        if (err) {
                            console.log("error: ", err);
                            return res.status(500).json(err.message);
                        } else
                            connection.query("DELETE  FROM todolists  WHERE userid = ?",
                                [user],
                                (err, results2) => {
                                    if (err) {
                                        console.log("error: ", err);
                                        return res.status(500).json(err.message);
                                    } else
                                        connection.query("DELETE FROM roles WHERE userid = ?",
                                            [user],
                                            (err, results3) => {
                                                if (err) {
                                                    console.log("error: ", err);
                                                    return res.status(500).json(err.message);
                                                } else
                                                    return;
                                        });
                                });
                        return;
                    });

            return res.status(200).json(results);
        })
};


module.exports = {findUser, findAllUsers, findAllLists, addUser, findRole, updateUser, deleteUser};


