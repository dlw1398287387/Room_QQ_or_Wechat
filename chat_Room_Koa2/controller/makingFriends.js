const utils = require('../resource/utils')
const makingImpl = require('../src/makingFriendsImpl')
const config = require('../config');
const jwt = require('jsonwebtoken');
const logger = require('logger').createLogger('chat_room.log');

async function searchEmail(ctx) {
    try {
        var whereStr = {
            email: ctx.request.body.email
        }
        await makingImpl.searchEmailImpl(whereStr).then(res => {
            console.log(res);
            res.password = "";
            res.openId = jwt.sign(res.openId, config.encrypt.JWT_SECRET);
            ctx.status = 200;
            ctx.body = res;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
        }).catch(err => {
            console.log(err)
            utils.koa_response_msg(ctx, err.code, err.msg)
            logger.error("Bad Request!  method:" + ctx.method + "，request url:" + ctx.url)
        })
    } catch (error) {
        utils.koa_response_msg(ctx, 500, "System error" + error);
        logger.error("System Error!  method:" + ctx.method + "，request url:" + ctx.url)
        throw error;
    }
}

async function addRecords(insertStr) {
    try {
        insertStr.status = 0;
        insertStr.openId = jwt.verify(insertStr.openId, config.encrypt.JWT_SECRET);
        insertStr.replyTo = jwt.verify(insertStr.replyTo, config.encrypt.JWT_SECRET);
        insertStr.correlationId = jwt.verify(insertStr.correlationId, config.encrypt.JWT_SECRET);
        delete insertStr._id
        console.log(insertStr)
        await makingImpl.addRecordsImpl(insertStr).then(res => {
            if (res.code == 200) {
                logger.info("Add Friend succeed! : Params:" + JSON.stringify(insertStr));
            } else {
                logger.error("Add Friend failing! : Params:" + JSON.stringify(insertStr));
            }
        }).catch(err => {
            console.log(err)
            logger.error("Bad Request!  addRecords")
        })
    } catch (error) {
        logger.error("System Error!  addRecords")
        throw error;
    }
}

/**
 * 查询申请添加好友信息
 * @param {*} ctx 
 */
async function findAddRecords(ctx) {
    try {
        var whereStr = {
            correlationId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        }
        await makingImpl.findAddRecordsImpl(whereStr).then(res => {
            ctx.status = 200;
            ctx.body = res;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
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

async function refuseAddRecords(ctx) {
    try {
        var whereStr = {
            email: ctx.request.body.email,
            openId: ctx.request.body.openId,
            correlationId: ctx.request.body.correlationId,
            replyTo: ctx.request.body.replyTo
        }
        var updateStr = {
            $set: {
                status: 2
            }
        }
        await makingImpl.refuseAddRecordsImpl(whereStr, updateStr).then(res => {
            ctx.status = res.code;
            ctx.body = res.msg;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
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

async function consentAddRecords(ctx) {
    try {
        // console.log(ctx.request.body)
        var insertStr1 = {
            openId: ctx.request.body.openId_u,
            friendId: jwt.verify(ctx.request.body.friendId_u, config.encrypt.JWT_SECRET),
            avatar: ctx.request.body.avatar_u,
            username: ctx.request.body.username_u,
            signature: ctx.request.body.signature_u,
            li: utils.verify_index(ctx.request.body.username_u[0])
        }
        var insertStr2 = {
            openId: jwt.verify(ctx.request.body.openId_i, config.encrypt.JWT_SECRET),
            friendId: ctx.request.body.friendId_i,
            avatar: ctx.request.body.avatar_i,
            username: ctx.request.body.username_i,
            signature: ctx.request.body.signature_i,
            li: utils.verify_index(ctx.request.body.username_i[0])
        }
        var whereStr = {
            email: ctx.request.body.email,
            openId: ctx.request.body.openId,
            correlationId: ctx.request.body.correlationId,
            replyTo: ctx.request.body.replyTo
        }
        await makingImpl.consentAddRecordsImpl(insertStr1, insertStr2, whereStr).then(res => {
            console.log(res);
            ctx.body = res;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
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

async function findByFriendList(ctx) {
    try {
        var whereStr = {
            openId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        }
        await makingImpl.findByFriendListImpl(whereStr).then(res => {
            ctx.status = 200;
            ctx.body = res;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
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
 * 
 * @param {*} ctx 
 */
async function findByFriendInformaton(ctx) {
    try {
        var whereStr = {
            openId: ctx.request.body.openId
        }
        await makingImpl.findByFriendInformatonImpl(whereStr).then(res => {
            ctx.status = 200;
            ctx.body = res;
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
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

async function updateFriendNote(ctx) {
    try {
        var whereStr = {
            openId: ctx.request.body.openId,
            friendId: ctx.request.body.friendId,
        }
        var updateStr = {
            $set: {
                note: ctx.request.body.note
            }
        }
        await makingImpl.updateFriendNoteImpl(whereStr, updateStr).then(res => {
            ctx.status = res.code;
            ctx.body = { message: res.msg };
            logger.info("Request! method:" + ctx.method + "，request url:" + ctx.url + "，Params:" + JSON.stringify(ctx.request.body));
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

async function deleteFriend(ctx) {
    try {
        var whereStr1 = {
            "openId": jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET),
            "friendId": ctx.query.friendId
        }
        var whereStr2 = {
            "openId": ctx.query.friendId,
            "friendId": jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
        }
        await makingImpl.deleteFriendImpl(whereStr1, whereStr2).then(res => {
            ctx.status = res.code;
            ctx.body = { message: res.msg };
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

module.exports = {
    searchEmail,
    addRecords,
    findAddRecords,
    refuseAddRecords,
    consentAddRecords,
    findByFriendList,
    findByFriendInformaton,
    updateFriendNote,
    deleteFriend
}