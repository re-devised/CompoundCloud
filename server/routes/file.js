const express = require('express');
const consola = require('consola')
const config = require('config');
//const axios = require('axios')
//const axiosInstance = axios.create()
//const FormData = require('form-data');
const getFileThenPost = require("get-file-then-post")
const app = express();
const fs = require('fs')
const multer = require('multer');
const fsextra = require('fs-extra');
const jsonfile = require('jsonfile')

const {getDiskSpace} = require('./diskspace')
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        let {storagePath} = await jsonfile.readFile('config/default.json')
                
        fsextra.mkdirsSync(storagePath);
        cb(null, storagePath)
      //cb(null, 'uploads/')
    },
    // filename: function (req, file, cb) {
    //   cb(null, Date.now() + '-' + file.originalname)
    // }
})
const fileFilter = (req, file, cb) => {
    // if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    //     cb(null, true)
    // }else{        
    //     //reject a files
    //     cb(null, false);
    // }
    cb(null, true)   
}
const upload = multer({
    storage: storage, 
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter   
});



const {File, validate} = require('../models/file');
const {Cloud} = require('../models/cloud')
const mongoose = require('mongoose');
const { nextTick } = require('process');


app.get('/', async (req, res) => {
    res.status(403).send('You are not authorized to perform this action') 
    const files = await File.find()
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })
    const response = {
        count: files.length,
        files: files
    }
    res.status(200).json(response)  
})

app.get('/:folder', async (req, res) => {
    const cloud = await Cloud.findById(req.params.folder)
        .populate('files')
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })
    const response = {
        count: cloud.files.length,
        files: cloud.files
    }
    res.status(200).json(response)         
})

app.get('/:folder/:id', async (req, res) => {
    const cloud = await Cloud.findById(req.params.folder)
        .populate('files')
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })
    const file = cloud.files.find((file) => file._id == req.params.id)
    res.status(200).json(file)
});

app.get('/:folder/:id/download', async (req, res) => {
    const cloud = await Cloud.findById(req.params.folder)
        .lean()    
        .populate('files')
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        })
    var file = cloud.files.find((b) => b._id == req.params.id);

    consola.info(file)
    // res.attachment(file.name);
    // consola.info(res.get('Content-Disposition'))
    // consola.info(`${process.cwd()}/${file.file}`)
    res.download(file.file, file.filename)
    
    // var fileName = file.filename;
    // res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);

    // res.setHeader('Content-Type', 'text/json');
    // res.setHeader('Content-disposition', `attachment; filename=${file.filename}`);
    // res.sendFile(`${process.cwd()}/${file.file}`);
      
    // file = null
    // res.status(200)
});


deleteFile = async function (cloudId, fileId, res){

    const cloud = await Cloud.findById(cloudId)
        .catch(err => consola.error(err))
        
    const file = await File.findById(fileId)
        .catch(err => consola.error(err)) 

    fs.unlink(file.file, (err) => {
        if(err){
            consola.error(new Error(err))
            return res.status(500).json({
                error: err
            })
        }
    })
    
    cloud.files.pull(fileId)    
    await cloud.save()
        .catch(err => {
            consola.error(new Error(err))
            return res.status(500).json({
                error: err
            })  
        })          

    await file.deleteOne()
        .then(result => {
            return true
        })
        .catch(err => {
            consola.error(new Error(err))
            return res.status(500).json({
                error: err
            }) 
        })
};


app.delete('/:folder/:id', async (req, res) => {
    await deleteFile(req.params.folder, req.params.id, res)
    res.status(200).send('File was deleted successfully')
});

testUrlEmbedded = async function (req, res, next){

    if(req.body.uploadFile && typeof req.body.uploadFile === "string"){
        getFileThenPost({
            "getUrl" : req.body.uploadFile,
            "postUrl" : `${process.env.BASE_URL || 'http://localhost:' + (process.env.PORT ? process.env.PORT : '5000')}/api/file/${req.params.folder}`,
            "fileName" : req.body.uploadFileName
        })
    }else next()
};

app.post('/:folder',[testUrlEmbedded, upload.single('uploadFile')], async (req, res) => {

    const cloud = await Cloud.findById(req.params.folder)
        .populate('files')
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        }) 
    
    if (!req.file) res.status(500).send('Please select a file for upload')
    var diskSpace = await getDiskSpace();
    if (diskSpace.free < req.file.size) res.status(507).send('There is not enough disk space available')

    const file = new File({
        file: req.file.path, 
        originalname: req.file.originalname,
        filename: req.file.originalname,
        size: req.file.size
    })
    
    var fileResult = null
    await file.save()
        .then(result => {
            fileResult = result
            cloud.files.push(result)
        })
        .catch(err => consola.error(err)) 

    await cloud.save()
        .then(result => {
            consola.info(fileResult)                    
            res.status(200).send(fileResult)
        })
        .catch(err => consola.error(err)) 
});

app.put('/:folder/:id', async (req, res) => {

    const cloud = await Cloud.findById(req.params.folder)
        .catch(err => {
            consola.error(new Error(err))
            res.status(500).json({
                error: err
            })
        }) 
    const isFileInCloud = cloud.files.find((file) => file._id == req.params.id)
    if (!isFileInCloud) res.status(404).send(`The given file is not found in Cloud ${cloud.name ? cloud.name : cloud._id}`)

    const file = await File.findById(req.params.id)
        .catch(err => consola.error(err)) 

    if (req.body.fileName == null) res.status(500).send('The field "name" can not be empty')

    file.filename = req.body.fileName

    await file.save()
        .then(result => {
            consola.info(result)
            res.status(200).send(result)
        })
        .catch(err => consola.error(err)) 
});

// module.exports = app
module.exports = {
    app,
    deleteFile
};
