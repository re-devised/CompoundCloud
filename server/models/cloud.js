const mongoose = require('mongoose');
const multer = require('multer');
const express = require('express');
const Joi = require('joi'); 
const {File} = require('./file')
const {User} = require('./user')

const cloudSchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    files: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }
    ],
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        default: ""
    },
    shared: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        directLink: {
            type: String
        }
    },
    isMain: {
        type: Boolean,
        required: true,
        default: false
    },
    onlinetime:{
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }    
})

const Cloud = mongoose.model('Cloud', cloudSchema)

validateCloud = function(req, res, next) {

    const schema = Joi.object({});  
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next()
}

module.exports.Cloud = Cloud;
module.exports.validate = validateCloud;