const jwt = require('jsonwebtoken')
const config = require('config')
const consola = require('consola')
const passport = require('passport')
const jsonfile = require('jsonfile')


// module.exports = function auth(req, res, next){    
//     const token = req.header('x-auth-token')
//     if(!token) return res.status(401).send('Access denied. No token provided.')

//     try{
//         const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
//         req.user = decoded
//         next()
//     }
//     catch(ex){
//         res.status(400).send('Invalid token.')
//     }
// } 

module.exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(401)
    }
}

module.exports.isAdmin = (req, res, next) => {
    if((req.isAuthenticated() && req.user.isAdmin)){
        next();
    }else{
        next(res.status(400))
    }
}

module.exports.isUserCreationAuth = (req, res, next) => {
    if((req.isAuthenticated() && req.user.isAdmin) || config.get('isSetupMode')){
        next();
    }else if(!config.get('adminsOnlyUserCreationMode')){
        req.body.isAdmin = false
        next()
    }else{
        next(res.status(400))
    }
}

module.exports.isSetupMode = (req, res, next) => {
    jsonfile.readFile('config/default.json')
        .then(settings => {
            if(settings['isSetupMode'] == true){
                next()
            }else next(403)
        })
        .catch(error => next(res.status(error.code)))
}

module.exports.auth = (req, res, next) => {
    passport.authenticate('local')
    next();
}
