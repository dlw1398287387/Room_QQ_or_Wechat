
var mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const fs = require('fs');
const utils = require('../resource/utils');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('logger').createLogger('chat_room.log');
Grid.mongo = mongoose.mongo;

//文件上传至 mongodb
async function uploadFile(ctx) {
    try {
        var conn = mongoose.connection;
        var gfs = Grid(conn.db);
        let writeStream = gfs.createWriteStream({ filename: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET) + "_" + utils.generateProductId() + ctx.request.files.file.name.toString().toLowerCase().substr(ctx.request.files.file.name.toString().length - 4) })
        // GridFSBucket 方式上传
        // const girdFSBucket = new mongoose.mongo.GridFSBucket(conn.db)
        // var writeStream = girdFSBucket.openUploadStream(jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET) + "_" + utils.generateProductId() + ctx.request.files.file.name.toString().toLowerCase().substr(ctx.request.files.file.name.toString().length - 4))
        var result = fs.createReadStream(ctx.request.files.file.path).pipe(writeStream);
        console.log(result)
        ctx.body = result.options
    } catch (error) {
        console.log(error)
        throw error;
    }
}

function finds(filename) {
    try {
        return new Promise((resolv, reject) => {
            var conn = mongoose.connection;
            var gfs = Grid(conn.db);
            gfs.files.find({ filename: filename }).toArray((err, files) => {
                // console.log(files)
                let data = [];
                if (files.length >= 1) {
                    let readstream = gfs.createReadStream({
                        filename: files[0].filename
                    });
                    readstream.on('data', (chunk) => {
                        data.push(chunk);
                    });
                    readstream.on('end', () => {
                        data = Buffer.concat(data);
                        let img = 'data:image/png;base64,' + Buffer.from(data).toString('base64');
                        // console.log(img)
                        resolv(img)
                        // console.log("sent", files[0].filename);
                    });
                } else {
                    console.log("暂无相关图片")
                }
            })
        })
    } catch (error) {
        throw error;
    }
}

//访问mongodb 图片，返回base64 访问方式
async function findFiles(ctx) {
    try {
        var imgs_Base64 = await finds(ctx.params.filename);
        // console.log(imgs_Base64);
        ctx.body = imgs_Base64;
        logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Base64:" + imgs_Base64);
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function download(ctx) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db);
    var fsWrite = fs.createWriteStream('./aaa.jpg');
    var readstream = gfs.createReadStream({
        filename: ctx.params.filename
    })
    readstream.pipe(fsWrite)
}

async function deleteFile(ctx) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db);
    gfs.remove({ filename: ctx.params.filename }, (err, res) => {
        console.log(err);
        console.log(res);
    })
}

module.exports = {
    uploadFile,
    findFiles,
    download,
    deleteFile
}