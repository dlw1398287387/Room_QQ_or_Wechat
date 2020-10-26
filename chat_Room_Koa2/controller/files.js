const fs = require('fs');
const path = require('path');
const logger = require('logger').createLogger('chat_room.log');
const utils = require('../resource/utils')

async function file_Upload_Avatar(ctx, email, command, file) {
    const reader = fs.createReadStream(ctx.request.files.file.path); //创建文件读取流
    var filePath = path.join(__dirname, '../public/images/', command) + `/${email + "_" + file.name}`;//文件写入地址
    //判断此文件夹是否存在，
    var dirStatus = await examineMkdir(path.join(__dirname, '../public/images/', command));
    if (dirStatus) {
        console.log("文件存在");
        const upSteam = fs.createWriteStream(filePath)//创建文件写入流
        reader.pipe(upSteam)//可读流通过管道写入可写流
        console.log("http://localhost:9999/" + command + `/${email + "_" + file.name}`)
        ctx.body = { fileurl: "http://localhost:9999/" + command + `/${email + "_" + file.name}` };
    } else {
        console.log("文件不存在");
        //当此文件目录不存在时创建他
        var createDir = await mkdir(path.join(__dirname, '../public/images/', command));
        if (createDir) {
            console.log("创建成功");
            const upSteam = fs.createWriteStream(filePath)//创建文件写入流
            reader.pipe(upSteam)//可读流通过管道写入可写流
            console.log("http://localhost:9999/" + command + `/${email + "_" + file.name}`)
            ctx.body = { fileurl: "http://localhost:9999/" + command + `/${email + "_" + file.name}` };
        } else {
            //如果创建失败直接返回错误请求，告知用户
            console.log("创建失败");
            ctx.body = { code: 201, msg: "文件上传失败！" }
        }
    }
}

async function file_Upload_Photo(ctx, email, command, file) {
    const reader = fs.createReadStream(ctx.request.files.file.path); //创建文件读取流
    var filePath = path.join(__dirname, '../public/images/', command, email) + `/${file.name}`;//文件写入地址
    //判断此文件夹是否存在，
    var dirStatus = await examineMkdir(path.join(__dirname, '../public/images/', command, email));
    if (dirStatus) {
        const upSteam = fs.createWriteStream(filePath)//创建文件写入流
        reader.pipe(upSteam)//可读流通过管道写入可写流
        console.log("http://localhost:9999/" + command + "/" + email + `/${file.name}`)
        ctx.body = { fileurl: "http://localhost:9999/" + command + "/" + email + `/${file.name}` };
    } else {
        console.log("文件不存在");
        //当此文件目录不存在时创建他
        var subfile1 = await examineMkdir(path.join(__dirname, '../public/images/', command));
        var subfile2 = await examineMkdir(path.join(__dirname, '../public/images/', command, email));
        if (!subfile1) {
            await mkdir(path.join(__dirname, '../public/images/', command));
        }
        if (!subfile2) {
            await mkdir(path.join(__dirname, '../public/images/', command, email));
        }
        const upSteam = fs.createWriteStream(filePath)//创建文件写入流
        reader.pipe(upSteam)//可读流通过管道写入可写流
        console.log("http://localhost:9999/" + command + "/" + email + `/${file.name}`)
        ctx.body = { fileurl: "http://localhost:9999/" + command + "/" + email + `/${file.name}` };
    }
}

/**
 * 文件上传
 * @param {*} ctx 
 */
async function fileUpload(ctx) {
    try {
        console.log(ctx);
        var email = ctx.query.email;
        var command = ctx.query.command;
        var file = ctx.request.files.file;
        switch (command) {
            case "Avatar":
                await file_Upload_Avatar(ctx, email, command, file);
                break;
            case "Photo":
                await file_Upload_Photo(ctx, email, command, file);
                break;
            case "Circle": {
                await file_Upload_Photo(ctx, email, command, file);
            }
        }
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error" + error);
        logger.error("File upload System Error! ")
        throw error;
    }
}

async function DeleteImg(arr) {
    return new Promise(() => {
        for (var i = 0; i < arr.length; i++) {
            fs.unlink(path.join(__dirname, '../public/images', arr[i].split("http://localhost:9999")[1]), function (err) {
                console.log(err)
                logger.error(err)
            })
        }
    })
}

/**
 * 删除文件
 * @param {} dir 
 */
async function DeleteFils(path) {
    return new Promise((resolv, reject) => {
        fs.unlink(path, function (err) {
            if (err) {
                throw err;
                resolv(false)
            }
            resolv(true)
        })
    })
}

/**
 * 检测文件夹目录是否存在
 * @param {*} dir 
 */
async function examineMkdir(dir) {
    return new Promise((resolv, reject) => {
        fs.exists(dir, function (exists) {
            if (exists) {
                resolv(true)
            }
            if (!exists) {
                resolv(false)
            }
        })
    })
}

/**
 * 创建文件夹目录
 * @param {*} dir 
 */
async function mkdir(dir) {
    return new Promise((resolv, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolv(false)
            } else {
                resolv(true)
            }
        })
    })
}

module.exports = {
    fileUpload,
    DeleteImg
}