const express = require('express')
const consola = require('consola')
const config = require('config')
const app = express()
const checkDiskSpace = require('check-disk-space').default
const byteSize = require('byte-size')
const path = require('path');
const jsonfile = require('jsonfile')


app.get('/', async (req, res) => {
    var diskSpace = await getDiskSpace();
    res.status(200).json(diskSpace)  
})

getDiskSpace = async function(){
    let {storagePath} = await jsonfile.readFile('config/default.json')
            
    var diskSpace = await checkDiskSpace(storagePath)
    return diskSpace     
    //.then((diskSpace) => {
        //console.log(byteSize(diskSpace.free, {units: 'iec'}))
        //console.log(byteSize(diskSpace.size, {units: 'iec'}))
        // {
        //     free: 12345678,
        //     size: 98756432
        // }
    //})
} 

app.post('/uploadpath', async (req, res) => {
    let localPath = __dirname.split('\\server\\routes')[0].split('/server/routes')[0]
    let uploadPath = path.resolve(localPath, req.body.pathInput)
    res.status(200).json(uploadPath)  
})

module.exports = {
    app,
    getDiskSpace
};