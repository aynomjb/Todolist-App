const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config/keys')
const salt = bcrypt.genSaltSync(10)

// IMPORT DB INSTANCE
const DB = require('../database/DB');

//CONFIG JWT STRATEGY
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.JWTAuthKey
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    let query = "SELECT * FROM users WHERE id=?";
    DB.query(query, [jwt_payload.userID], function(error, results, fields) {

        if (error) {

            return done(error, false)
        } else {
            
            if (results.length == 0) {
                return done(null, false)
            } else {
                return done(null, jwt_payload)
            }
        }
    })
}))
module.exports = passport