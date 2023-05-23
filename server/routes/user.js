const {User, validate} = require('../models/user')
const {Cloud} = require('../models/cloud')
const {deleteCloud} = require('./cloud')
const express = require('express');
const app = express();
const consola = require('consola')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const {isAuth, isAdmin, isUserCreationAuth, auth} = require('../middleware/auth')
const mongoose = require('mongoose')

const config = require('config')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const { exist } = require('joi');
const linkMainCloud = require('./sharedFunctions/linkMainCloud')
require('../passport/passport-config')(passport)


// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));

// app.use(session({
//     secret: config.get('session_secret'),
//     resave: false,
//     saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())


app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        var user = req.user.toObject()
        delete user.password
        res.status(200).send(user)    
    }
);

app.get('/logout', (req, res) => {
    req.logout()
    if (req.session) {
        req.session.destroy()
    }
    res.clearCookie("compound-session")
    res.sendStatus(200)
})

app.get('/admin', isAdmin, async (req, res) => {
    const users = await User.find()
        .select('_id username createdAt clouds mainCloud isAdmin')
        .lean()
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })
    for(var user in users){
        var user = users[user]
        if(user.mainCloud) user.clouds.push(user.mainCloud)
        user.clouds = (user.clouds).length
        delete user['mainCloud']
        // user.save
    }

    const response = {
        count: users.length,
        users: users
    }   

    res.status(200).send(response)
});

app.post('/me', auth, async (req, res) => {
    if(req.isAuthenticated()){
        var user = await User.findById(req.user._id /*from middleware*/)
            .select('-password')
            .populate(['clouds', 'mainCloud'])
        res.status(200).json(user)
    }else res.status(200).send(null)
});

app.post('/', isUserCreationAuth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    var existingUser = await User.findOne({$or:[
        { "username": req.body.username }
    ]})
    if(existingUser) return res.status(400).send('This username is already taken')

    var user = new User(_.pick(req.body, ['username', 'password', 'isAdmin']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await linkMainCloud(user, res)
        .then(_ => {
            user.save()
        })

    var userRes = user.toObject()
    if(userRes.mainCloud) userRes.clouds.push(userRes.mainCloud)
    userRes.clouds = (userRes.clouds).length
    delete userRes['mainCloud']
    delete userRes['password']
    res.status(200).send(userRes)
    

    // const token = user.generateAuthToken()
    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'email']));
});

app.delete('/:id', isAdmin, async (req, res) => {
    const user = await User.findById(req.params.id)
        .catch(err => {
            consola.error(new Error(err))
            return res.status(500).json({
                error: err
            })
        })
    async function deleteClouds() {
        if(user.clouds){
            for(var cloud in user.clouds){            
                await deleteCloud(user.clouds[cloud], res)
            }
        }
        if(user.mainCloud){
            await deleteCloud(user.mainCloud, res)
        }
    }
    await deleteClouds()
    .catch(err => consola.error(err))
    .then(_ => {
        user.deleteOne()
        res.sendStatus(200)
    }) 
});


// app.put('/admin')

app.delete('/:id/closecloud/:cloud', async (req, res) => {

    const user = await User.findById(req.params.id)
        .populate('clouds')
    if (!user) return res.status(404).send('This user was not found');
    
    const cloud = user.clouds.find(c => c._id == req.params.cloud)
    if(cloud.isMain == true) return res.status(403).send('The main cloud of a user cannot be removed')

    user.clouds.pull(req.params.cloud)
    user.save()

    res.status(200).send(user)
});

// app.delete('/:id/deletecloud/:cloud', async (req, res) => {

  
// });

openCloudForUser = async function(cloud, userId, res) {
    const user = await User.findById(userId) 
    if (!user) return res.status(404).send('This user was not found');
    // if (cloud.creator && cloud.creator._id != user._id) return res.status(401).send('Diese Cloud kann nur von dem Ersteller geöffnet werden');
    user.clouds.push(cloud)
    user.save()
    return true
}

app.put('/:id/opencloud', async (req, res) => {
    // consola.info(req.body.cloud)
    //     consola.info(req.params.id)
    //   const { error } = validate(req.body); 
    //   if (error) return res.status(400).send(error.details[0].message);
    const cloud = req.body.cloud
    if (!cloud) return res.status(404).send('This cloud was not found');

    await openCloudForUser(cloud, req.params.id, res)

    res.send(req.body.cloud);
});

app.put('/:id/rename', async (req, res) => {

    const user = await User.findById(req.params.id)
        .populate('mainCloud')
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        }) 

    if (!user) res.status(404).send('This user was not found')
    if (!req.body.name) res.status(500).send('The field "name" must not be empty')

    const mainCloud = user.mainCloud
    if(mainCloud && mainCloud.isMain === true){
        mainCloud.name = req.body.name
        mainCloud.save()
    }
        
    user.username = req.body.name

    var userRes = await user.save()
        .catch(err => res.status(500))

    userRes = userRes.toObject()
    if(userRes.mainCloud) userRes.clouds.push(userRes.mainCloud)
    userRes.clouds = (userRes.clouds).length
    delete userRes['mainCloud', 'password']
    res.status(200).send(userRes)
});



module.exports = {
    app,
    openCloudForUser
}
