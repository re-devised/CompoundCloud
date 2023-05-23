const express = require('express');
const consola = require('consola')
const app = express();
const fs = require('fs')


const {deleteFile} = require('./file')
const {openCloudForUser} = require('./user')
const {Cloud, validate} = require('../models/cloud');
const {isAdmin} = require('../middleware/auth')
const mongoose = require('mongoose');


app.get('/admin', isAdmin, async (req, res) => {
    const clouds = await Cloud.find()
        .lean()
        .populate(['creator', 'files'])
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })  
    for(var cloud in clouds){
        if(clouds[cloud].creator) delete clouds[cloud].creator.password       
    }

    const response = {
        count: clouds.length,
        clouds: clouds
    }   

    res.status(200).send(response)
});

app.post('/check', async (req, res) => { //Get multiple clouds by _id or name
    const clouds = await Cloud.find()
        .lean()
        .populate(['creator', 'files'])
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })  
    for(var cloud in clouds){
        if(clouds[cloud].creator) delete clouds[cloud].creator.password       
    }

    var searchedClouds = req.body.clouds
    var cloudPlaceholder = null
    var foundClouds = []
    var unknownClouds = []
    for(var s in searchedClouds){
        for(var f in clouds) {
            if(searchedClouds[s] == clouds[f]._id){
                cloudPlaceholder = clouds[f]
            }
            if(searchedClouds[s] == clouds[f].name){
                cloudPlaceholder = clouds[f]
            }
        }
        if(cloudPlaceholder) foundClouds.push(cloudPlaceholder)
        else unknownClouds.push(searchedClouds[s])
        cloudPlaceholder = null
    }
    

    const response = {
        found: foundClouds,
        unknown: unknownClouds
    }

    res.status(200).send(response)
});

app.get('/:id', async (req, res) => { //Get one cloud with _id
    const cloud = await Cloud.findById(req.params.id)
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })
    res.status(200).send(cloud)
});

app.post('/', async (req, res) => {

    const cloud = new Cloud({
        creator: req.body.creator,
        name: req.body.name, 
        onlinetime: req.body.onlinetime,
        shared: { status: req.body.shared }
    })   

    if(req.body.creator){
        await openCloudForUser(cloud, req.body.creator, res)
    }

    await cloud.save()
        .then(async () => {
            await Cloud.populate(cloud, 'creator')
            res.status(200).send(cloud)
        })
        .catch(err => consola.error(err))
});

app.put('/:id/rename', async (req, res) => {

    const cloud = await Cloud.findById(req.params.id)
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        }) 

    //IRGENDWIE HAT DER ÜBERALL DAS PROBLEM AUF DAS ERSTE ELEMENT DES ARRAYS ZUZUUGREIFEN (ismain = undefined)
    if (!cloud) return res.status(404).send(`This cloud was not found`)
    if (cloud.isMain) return res.status(403).send('The maincloud of a user must not be renamed')
    if (!req.body.name) return res.status(500).send('The name field must not be empty')

    cloud.name = req.body.name

    await cloud.save()
        .then(result => {
            consola.info(result)
            res.status(200).send(result)
        })
        .catch(err => consola.error(err)) 
});

app.put('/:id/changeclouddescription', async (req, res) => {

    const cloud = await Cloud.findById(req.params.id)
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        }) 

    if (!cloud) return res.status(404).send(`This cloud was not found`)
    // if (!req.body.description) return res.status(500).send('Das Feld name darf nicht leer sein')

    cloud.description = req.body.description

    await cloud.save()
        .then(result => {
            consola.info(result)
            res.status(200).send(result)
        })
        .catch(err => consola.error(err)) 
});


deleteCloud = async function (cloudId, res){
    var cloud = await Cloud.findById(cloudId)
        .populate('creator')
        .catch(err => {
            consola.error(new Error(err))
            return res.status(500).json({
                error: err
            })
        })
    async function deleteFiles() {
        for(var file in cloud.files){
            await deleteFile(cloud._id, cloud.files[file]._id, res)
        }
    }
    await deleteFiles()
    .catch(err => consola.error(err))
    .then(_ => {
        if(cloud.creator && cloud.creator.mainCloud.toString() != cloudId){
            creator = cloud.creator
            creator.clouds.pull({ _id: cloudId })
            creator.save()
        }
        cloud.deleteOne()
        return true
    }) 
}

app.delete('/:id', async (req, res) => {
    await deleteCloud(req.params.id, res)
    res.status(200).send('Cloud was deleted successfully')
});

module.exports = {
    app,
    deleteCloud
};
