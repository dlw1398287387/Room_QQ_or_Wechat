module.exports = async function (ctx, next) {
    const logger = require('logger').createLogger('chat_room.log')
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: error };
        logger.error("auth_middleware ==》》 auth error" + error)
    }
}