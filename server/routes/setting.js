const express = require('express');
const consola = require('consola')
const app = express();
const fs = require('fs')
const config = require('config')
const jsonfile = require('jsonfile')
const isDocker = require('is-docker')

const {isAdmin, isSetupMode} = require('../middleware/auth')


const mongoose = require('mongoose');


app.get('/admin', async (req, res) => {
    let settings = {}
    jsonfile.readFile('config/default.json')
        .then(obj => {
            settings['isSetupMode'] = obj['isSetupMode']
            settings['adminsOnlyUserCreationMode'] = obj['adminsOnlyUserCreationMode']
            settings['storagePath'] = obj['storagePath']
            res.status(200).send(settings)
        })
        .catch(error => console.error(error))
});

app.get('/docker', async (req, res) => {
    if(isDocker()) res.status(200).send(true)
    else res.status(200).send(false)
});


app.post('/disablesetupmode', async (req, res) => {

    jsonfile.readFile('config/default.json')
        .then(obj => {
            obj['isSetupMode'] = false
            jsonfile.writeFile('config/default.json', obj, { spaces: 4, EOL: '\r\n' })
            .then(_ => {
                console.log('SetupMode disabled.')
                res.status(200).send('SetupMode disabled.')
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
});

app.post('/usercreationmode', isAdmin, async (req, res) => {

    if(typeof (req.body.value) == "undefined") res.status(500).send("Das Feld value darf nicht leer sein")

    jsonfile.readFile('config/default.json')
    .then(obj => {
        if(obj['isSetupMode']){
            obj['adminsOnlyUserCreationMode'] = req.body.value
                
                jsonfile.writeFile('config/default.json', obj, { spaces: 4, EOL: '\r\n' })
                    .then(_ => {
                        console.log('adminsOnlyUserCreationMode set to ' + req.body.value + ".")
                        res.status(200).send('adminsOnlyUserCreationMode set to ' + req.body.value + ".")
                    })
                    .catch(error => console.error(error))
            }
        })
        .catch(error => console.error(error))
});

app.post('/changestoragepath', isSetupMode, async (req, res) => {

    if(typeof (req.body.pathInput) == "undefined") res.status(500).send('The field "pathInput" must not be empty')

    jsonfile.readFile('config/default.json')
        .then(obj => {
                obj['storagePath'] = req.body.pathInput
                    
                jsonfile.writeFile('config/default.json', obj, { spaces: 4, EOL: '\r\n' })
                    .then(_ => {
                        console.log('storagePath set to ' + req.body.pathInput + ".")
                        res.status(200).send('storagePath set to ' + req.body.pathInput + ".")
                    })
                    .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
});



module.exports = {
    app
};
