const chatImpl = require('../src/chatImpl');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('logger').createLogger('chat_room.log');

async function pushMsghistory(content) {
    try {
        var whereStr1 = {
            openId: content.openId,
            friendId: content.correlationId,
        }
        var whereStr2 = {
            openId: content.correlationId,
            friendId: content.openId,
        }
        var updateStr = {
            $push: {
                msgs: content.msgs
            }
        }
        await chatImpl.pushMsghistoryImpl(whereStr1, whereStr2, updateStr).then(res => {
            if (res.code == 200) {
                logger.info("Save your chat history succeed! -- whereStr1:" + JSON.stringify(whereStr1) + "：whereStr2：" +
                    JSON.stringify(whereStr2) + "updateStr：" + JSON.stringify(updateStr));
            } else {
                logger.error("Save your chat history failing! -- whereStr1:" + JSON.stringify(whereStr1) + "：whereStr2：" +
                    JSON.stringify(whereStr2) + "updateStr：" + JSON.stringify(updateStr));
            }
        }).catch(err => {
            logger.error("Bad Request!  addRecords" + JSON.stringify(err))
        })
    } catch (error) {
        logger.error("System Error!  addRecords")
        throw error;
    }
}


async function clearChathistory(ctx) {
    try {
        var whereStr = {
            openId: jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET),
            friendId: ctx.request.body.friendId
        }
        var updateStr = {
            $set: {
                msgs: []
            }
        }
        await chatImpl.clearChathistoryImpl(whereStr, updateStr).then(res => {
            ctx.status = res.code;
            ctx.body = res.msg;
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
    pushMsghistory,
    clearChathistory
}