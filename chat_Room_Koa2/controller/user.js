var utils = require('../resource/utils');
var userImpl = require('../src/userImpl');
const logger = require('logger').createLogger('chat_room.log');
const config = require('../config');
const jwt = require('jsonwebtoken')

/**
 * 注册获取邮箱验证码
 * @param {*} ctx 
 */
async function SendEmail(ctx) {
    try {
        var insertStr = {
            email: ctx.request.body.email,
            auth_code: utils.verificationCode(),
        }
        await userImpl.SendEmailImpl(insertStr).then(res => {
            utils.koa_response_msg(ctx, res.code, res.msg)
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body))
        }).catch(err => {
            utils.koa_response_msg(ctx, err.code, err.msg)
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url)
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error" + error);
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url)
        throw error;
    }
}

/**
 * 用户注册
 * @param {*} ctx 
 */
async function register(ctx) {
    try {
        var whereStr_code = {
            email: ctx.request.body.email,
            auth_code: ctx.request.body.auth_code
        }
        var insertStr = ctx.request.body;
        insertStr.openId = utils.generateProductId();
        insertStr.username = insertStr.email;
        insertStr.avatar = "http://localhost:9999/logo.png"; //本地nginx访问路径
        insertStr.password = utils.auth_password(insertStr.password);
        await userImpl.registerImpl(whereStr_code, insertStr).then(res => {
            utils.koa_response_msg(ctx, res.code, res.msg);
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
        }).catch(err => {
            utils.koa_response_msg(ctx, err.code, err.msg);
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url);
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error");
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url);
        throw error;
    }
}

async function login(ctx) {
    try {
        var whereStr = {
            email: ctx.request.body.email,
            password: utils.auth_password(ctx.request.body.password)
        }
        await userImpl.loginImpl(whereStr).then(res => {
            var userinfo = res[0]
            userinfo.openId = jwt.sign(userinfo.openId, config.encrypt.JWT_SECRET);
            userinfo.password = ""
            ctx.status = 200;
            ctx.body = userinfo;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
        }).catch(err => {
            utils.koa_response_msg(ctx, err.code, err.msg);
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url);
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error");
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url);
        throw error;
    }
}

async function updateUser(ctx) {
    try {
        var whereStr = { 
            openId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        } 
        var updateStr = ctx.request.body;
        await userImpl.updateUserImpl(whereStr, updateStr).then(res => {
            var userinfo = res[0]
            userinfo.openId = jwt.sign(userinfo.openId, config.encrypt.JWT_SECRET);
            userinfo.password = ""
            ctx.status = 200;
            ctx.body = userinfo;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
        }).catch(err => {
            utils.koa_response_msg(ctx, err.code, err.msg);
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url);
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error");
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url);
        throw error;
    }
}

async function createPhoto(ctx) {
    try {
        var whereStr = {
            openId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        }
        var updateStr = {
            $push: {
                "photo_album": ctx.request.body.createPhoto
            }
        }
        await userImpl.createPhotoImpl(whereStr, updateStr).then(res => {
            if (res.errors == null) {
                var userinfo = res
                userinfo.openId = jwt.sign(userinfo.openId, config.encrypt.JWT_SECRET);
                userinfo.password = ""
                ctx.status = 200;
                ctx.body = userinfo;
                logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
            } else {
                utils.koa_response_msg(ctx, 203, "create photo error !")
            }
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error");
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url);
        throw error;
    }
}

async function updatePhoto(ctx) {
    try {
        var whereStr = {
            openId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        }
        var updateStr = {
            $push: {
                "photo_album.$[t].imgs": { img: ctx.request.body.fileurl, status: false }
            }
        }
        var options = {
            arrayFilters: [{
                "t.photo_name": ctx.request.body.photo_name,
            }],
            multi: true
        }
        await userImpl.updatePhotoImpl(whereStr, updateStr, options).then(res => {
            var userinfo = res[0]
            userinfo.openId = jwt.sign(userinfo.openId, config.encrypt.JWT_SECRET);
            userinfo.password = ""
            ctx.status = 200
            ctx.body = userinfo;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
        }).catch(err => {
            utils.koa_response_msg(ctx, err.code, err.msg);
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url);
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error");
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url);
        throw error;
    }
}

async function deletePhotoItem(ctx) {
    try {
        var whereStr = {
            openId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        }
        var updateStr = {
            $pull: {
                "photo_album.$[t].imgs": { img: { $in: ctx.request.body.photoArr } }
            }
        }
        var options = {
            arrayFilters: [{
                "t.photo_name": ctx.request.body.photo_name,
            }],
            multi: true
        }
        await userImpl.updatePhotoImpl(whereStr, updateStr, options).then(res => {
            var userinfo = res[0]
            userinfo.openId = jwt.sign(userinfo.openId, config.encrypt.JWT_SECRET);
            userinfo.password = ""
            ctx.status = 200
            ctx.body = userinfo;
            var file = require('./files')
            file.DeleteImg(ctx.request.body.photoArr)
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
        }).catch(err => {
            utils.koa_response_msg(ctx, err.code, err.msg);
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url);
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error");
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url);
        throw error;
    }
}

module.exports = {
    SendEmail,
    register,
    login,
    updateUser,
    createPhoto,
    updatePhoto,
    deletePhotoItem
}