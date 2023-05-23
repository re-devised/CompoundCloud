const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { User } = require('../models/user')
const consola = require('consola')


module.exports = (passport) => {
    const authenticateUser = async (username, password, done) => {
        User.findOne({username: username})
            .populate(['clouds', 'mainCloud'])
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'This user was not found'})
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err
                    if(isMatch){
                        return done(null, user)
                    }else{
                        return done(null, false, {message: 'Wrong password'})
                    }
                })
            })
            .catch(err => {
                consola.info(err)
            })
    }

    passport.use(new LocalStrategy({ 
        usernameField: 'username',
        passwordField: 'password'
    }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

// module.exports = initialize
