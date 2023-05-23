const mongoose = require('mongoose');
const config = require('config');
const consola = require('consola')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

var mongoConnection = `mongodb${process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD ? "+srv" : ""}://${process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD ? process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@" : ""}${process.env.MONGO_URL || 'mongo:27017'}/CompoundCloud`
// require("../models/user");

exports.initSessionStore = function() { //only for the session saving
    const store = new MongoDBStore({
        uri: mongoConnection,
        collection: 'sessions'
    })

    store.on('error', (err) => consola.error(new Error(err)))

    return store;
}

exports.connect = function() { //actual connecting
    return mongoose.connect(mongoConnection, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true})
        .then(() => consola.success('Database connected'))
        .catch(err => {
            consola.error(new Error(err))
            consola.info("Couldn't connect to MongoDB Database. To change the connection details, set the environment variable MONGO_URL to the connetion url (eg: 'cloud.ukffp.mongodb.net') and if specified MONGO_USERNAME to the connection username and MONGO_PASSWORD to the connection password.")
            consola.info("Current connection string: " + mongoConnection)
            process.exit()
        });
}