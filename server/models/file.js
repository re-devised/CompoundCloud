const mongoose = require('mongoose');
const multer = require('multer');
const express = require('express');
const Joi = require('joi'); 

const fileSchema = new mongoose.Schema({
    // creator: {
    //     type: new mongoose.Schema({
    //         username: {
    //             type: String,
    //             required: true,
    //             minlength: 5,
    //             maxlength: 50
    //         },
    //         _id: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             required: true
    //         }
    //     }),
    //     required: true
    // },
    // _id: {
    //     type: mongoose.ObjectId,
    //     default: new mongoose.Types.ObjectId()
    // },
    file: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }    
})

const File = mongoose.model('File', fileSchema)

validateFile = function(req, res, next) {

    const schema = Joi.object({});  
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next()
}

module.exports.File = File;
module.exports.validate = validateFile;