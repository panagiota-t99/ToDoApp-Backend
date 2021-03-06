const connection = require("../services/db.js");

findAllItems = (req, res) => {
    connection.query("SELECT itemname,itemsid,todoitems.dateCreated,todoitems.dateModified,reminder FROM todoitems,todolists WHERE todolists.listid = ? AND todoitems.listid = todolists.listid",
        [req.params.listid], (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
};

updateListName = (req, res) => {
    console.log("here", req.body);
    connection.query("UPDATE todolists SET listname = ?,dateModified = ? WHERE listid = ?",
        [req.body.listname, req.body.dateModified, req.body.listid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }

            let message = "User edited list name (id: " + req.body.listid + ", name: " + req.body.listname + ")";
            connection.query("INSERT INTO logs (userid, message, action,id,name) VALUES (?,?, 'UPDATE',?,?)",
                [req.id, message,req.body.listid,req.body.listname],
                (err, res_logs) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(results);
                });
        });
};

updateItemName = (req, res) => {
    connection.query("UPDATE todoitems SET itemname = ?, dateModified = ? WHERE itemsid = ?",
        [req.body.itemname, req.body.dateModified, req.body.itemsid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }

            let message = "User edited item name (id: " + req.body.itemsid + ", name: " + req.body.itemname + ") in list (name:" + req.body.listname + ")";
            connection.query("INSERT INTO logs (userid, message, action,id,name) VALUES (?,?, 'UPDATE',?,?)",
                [req.id, message,req.body.itemsid,req.body.itemname],
                (err, res_logs) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(results);
                });
        });
};

updateReminder = (req, res) => {
    connection.query("UPDATE todoitems SET reminder = ? WHERE itemsid = ?",
        [req.body.reminder, req.body.itemsid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
};

deleteList = (req, res) => {
    connection.query("DELETE todolists,todoitems FROM todolists INNER JOIN todoitems ON todoitems.listid = todolists.listid AND todolists.listid = ?",
        [req.params.listid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);

            }
            connection.query("DELETE FROM todolists WHERE listid = ?",
                [req.params.listid],
                (err, results) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    } else return;
            });
            let message = "User deleted list (name: " + req.params.listname + ')';
            connection.query("INSERT INTO logs (userid, message, action,id,name) VALUES (?,?, 'DELETE',?,?)",
                [req.id, message, req.params.listid, req.params.listname],
                (err, results3) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(results);

                });
        });

};

deleteItem = (req, res) => {
    connection.query("DELETE FROM todoitems WHERE itemsid = ?",
        [req.params.itemsid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);

            }
            let message = "User deleted item (name: " + req.params.itemname + ")";
            connection.query("INSERT INTO logs (userid, message, action,id,name) VALUES (?,?, 'DELETE',?,?)",
                [req.id, message,req.params.itemsid, req.params.itemname],
                (err, results2) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(results);

                });
        });
};

deleteReminder = (req, res) => {
    connection.query("UPDATE todoitems SET reminder = null WHERE itemsid = ?",
        [req.body.itemsid],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            return res.status(200).json(results);
        });
};


addList = (req, res) => {

    connection.query("INSERT INTO todolists (userid, listname) VALUES (?,?)",
        [req.id, req.body.listname],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            let message = "User added list (name:" + req.body.listname + ")";
            console.log(results);
            connection.query("INSERT INTO logs (userid, message, action,id,name) VALUES (?,?, 'ADD',?,?)",
                [req.id, message,results.insertId,req.body.listname],
                (err, results2) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(results);

                });

        });
};

addItem = (req, res) => {
    connection.query("INSERT INTO todoitems (listid, itemname) VALUES (?,?)",
        [req.body.id, req.body.itemname],
        (err, results) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json(err.message);
            }
            let message = "User added item (name:" + req.body.itemname + ") to list (name:" + req.body.listname + ")";
            connection.query("INSERT INTO logs (userid, message, action,id,name) VALUES (?,?, 'ADD',?,?)",
                [req.id, message,results.insertId,req.body.itemname],
                (err, results2) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(results);
                });
        });
};

module.exports = {findAllItems, updateListName, updateItemName, deleteList, deleteItem, addList, addItem, updateReminder, deleteReminder};
