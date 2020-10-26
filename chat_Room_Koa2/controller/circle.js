const circleImpl = require('../src/circleImpl');
const jwt = require('jsonwebtoken');
const config = require('../config');
const utils = require('../resource/utils');
const logger = require('logger').createLogger('chat_room.log');

async function addCircle(ctx) {
    try {
        var insertStr = ctx.request.body;
        insertStr.openId = jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET);
        console.log(insertStr)
        await circleImpl.addCircleImpl(insertStr).then(res => {
            ctx.status = res.code;
            ctx.body = { message: res.msg };
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

async function findByfriendCircle(ctx) {
    try {
        var whereStr = [
            {
                $lookup:
                {
                    from: "circles",
                    localField: "openId",
                    foreignField: "openId",
                    as: "circleDetails"
                }
            },
            {
                $match: {
                    "friendId": jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET)
                }
            },
            {
                $project: {
                    // openId: 1,
                    // friendId: 1,
                    // avatar: 1,
                    // username: 1,
                    circleDetails: 1,
                    note: 1
                }
            },
            { $unwind: "$circleDetails" },
            // { $skip: parseInt(ctx.query.skip) },
            // { $limit: parseInt(ctx.query.limit) },
            {
                $sort: { "circleDetails.createTime": -1 }
            }
        ]
        await circleImpl.findByfriendCircleImpl(whereStr).then(res => {
            ctx.status = 200;
            ctx.body = res;
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

async function findByMeCircle(ctx) {
    try {
        var whereStr = { "openId": jwt.verify(ctx.headers.authorization, config.encrypt.JWT_SECRET) }
        await circleImpl.findByMeCircleImpl(whereStr).then(res => {
            ctx.status = 200;
            ctx.body = res;
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
    addCircle,
    findByfriendCircle,
    findByMeCircle
}