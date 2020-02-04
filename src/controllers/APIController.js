const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const config = require('../config/keys');
const jwt = require('jsonwebtoken');

// IMPORT DB INSTANCE
const DB = require('../database/DB');

function getMySQLTimeStamp() {
    let date = new Date();
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

exports.authenticate = (req, res, next) => {
    let query = "SELECT * FROM users WHERE email=?";
    DB.query(query, [req.body.email], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
            if (results.length == 0) {
                res.json({
                    success: false,
                    message: "user not found"
                })
            } else {
                bcrypt.compare(req.body.password, results[0].password, function(err, result) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Some error occured'
                        })
                    } else if (!result) {
                        res.json({
                            success: false,
                            message: 'Invalid Password'
                        })
                    } else {
                        let userData = {
                            userID: results[0].id,
                            name: results[0].name,
                            email: results[0].email,
                            IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                            userAgent: req.headers['user-agent']
                        }
                        const token = jwt.sign(userData, config.JWTAuthKey, {
                            expiresIn: 60 * 60 * 24
                        })
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    }
                })
            }
        }
    });
}
exports.checkAuth = (req, res, next) => {
    res.json({
        success: true,
        user: req.user
    })
}
exports.signup = (req, res, next) => {
    let query = "SELECT * FROM users WHERE email= ?";
    DB.query(query, [req.body.email], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
           
            if (results.length > 0) {
                res.json({
                    success: false,
                    message: 'Email already in use'
                })
            } else {
                let query = "INSERT INTO users (name, email,password) VALUES (?,?,?)";
                DB.query(query, [req.body.name, req.body.email, bcrypt.hashSync(req.body.password, salt)], function(error, results, fields) {
                    if (error) {
                        res.json({
                            success: false,
                            error
                        })
                    } else {
                        res.json({
                            success: true,
                            results
                        })
                    }
                });
            }
        }
    });
}
exports.changePassword = (req, res, next) => {
    let query = "UPDATE users SET password= ? , updated_at= ? WHERE id= ? ";
    DB.query(query, [bcrypt.hashSync(req.body.password, salt), getMySQLTimeStamp(), req.user.userID], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
            res.json({
                success: true,
                results
            })
        }
    });
}
exports.addTask = (req, res, next) => {
    let query = "INSERT INTO todolist (user_id, date, title, status) VALUES (?,?,?,?)";
    DB.query(query, [req.user.userID, req.body.date, req.body.title, req.body.status], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
            res.json({
                success: true,
                results
            })
        }
    });
}
exports.updateTask = (req, res, next) => {
    let query = "UPDATE todolist SET  date=?, title=?, status=?, updated_at= ? WHERE id = ? AND user_id = ? ";
    DB.query(query, [req.body.date, req.body.title, req.body.status, getMySQLTimeStamp(), req.body.task_id, req.user.userID], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
            res.json({
                success: true,
                results
            })
        }
    });
}
exports.deleteTask = (req, res, next) => {
    let query = "DELETE FROM todolist WHERE id=? AND user_id = ?";
    DB.query(query, [req.body.task_id, req.user.userID], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
            res.json({
                success: true,
                results
            })
        }
    });
}
exports.getTasks = (req, res, next) => {
    let query = "SELECT * FROM todolist WHERE user_id=?";
    DB.query(query, [req.user.userID], function(error, results, fields) {
        if (error) {
            res.json({
                success: false,
                error
            })
        } else {
            res.json({
                success: true,
                results
            })
        }
    });
}