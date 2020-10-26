var utils = require('../resource/utils')
var auth_session = require('../model/auth_session')
var user = require('../model/users')
var friend = require('../model/friend_list')
var circle = require('../model/circle')
const logger = require('logger').createLogger('chat_room.log')


async function SendEmailImpl(insertStr) {
    return new Promise((resolv, reject) => {
        user.find({ "email": insertStr.email }).then(res1 => {
            if (res1.length >= 1) {
                reject({ code: 203, msg: 'This account already exists and cannot be re-registered' })
                logger.info("Dao : register send email account exist =>>> Account: " + insertStr.email)
            } else {
                var auth_sessions = new auth_session(insertStr);
                auth_sessions.save(insertStr).then(res2 => {
                    if (res2 != null) {
                        utils.SendEmail(insertStr.email, insertStr.auth_code).then(res3 => {
                            if (res3.code == 200) {
                                resolv({ code: 200, msg: res3.msg })
                                logger.info("Dao : register send email Success =>>> Account: " + insertStr.email)
                            } else {
                                reject({ code: 203, msg: res3.msg })
                                logger.info("Dao : register send email Failing =>>> Account: " + insertStr.email)
                            }
                        })
                    } else {
                        reject({ code: 500, msg: 'System error' })
                        logger.info("Dao : register send email Save DB Failing")
                    }
                })
            }
        })
    })
}

async function registerImpl(whereStr, insertStr) {
    return new Promise((resolv, reject) => {
        auth_session.find(whereStr).then(res1 => {
            if (res1.length >= 1) {
                var users = new user(insertStr);
                user.find({ email: whereStr.email }).then(res2 => {
                    if (res2.length >= 1) {
                        resolv({ code: 203, msg: "The account has been successfully registered" })
                    } else {
                        users.save(insertStr).then(res3 => {
                            if (res3) {
                                resolv({ code: 200, msg: "registered Successfully" })
                            } else {
                                reject({ code: 203, msg: "registered fail" })
                            }
                        })
                    }
                })
            } else {
                reject({ code: 203, msg: "Illegal validation" })
            }
        })
    })
}

async function loginImpl(whereStr) {
    return new Promise((resolv, reject) => {
        user.find({ email: whereStr.email }).then(res => {
            if (res.length == 1) {
                if (res[0].password == whereStr.password) {
                    resolv(res)
                } else {
                    reject({ code: 203, msg: "密码错误，请输入正确密码" })
                }
            } else {
                reject({ code: 203, msg: "暂无账户信息，请前往注册" })
            }
        })
    })
}

async function updateUserImpl(whereStr, updateStr) {
    return new Promise((resolv, reject) => {
        user.updateOne(whereStr, updateStr).then(res1 => {
            if (res1.ok == 1 && res1.n == 1) {
                if (updateStr.avatar != null || updateStr.username != null) {
                    circle.updateMany(whereStr, updateStr).then(res2 => {
                        friend.updateMany({ friendId: whereStr.openId }, updateStr).then(res3 => {
                            user.find(whereStr).then(res4 => {
                                resolv(res4)
                            })
                        })
                    })
                } else {
                    user.find(whereStr).then(res2 => {
                        resolv(res2)
                    })
                }
            } else {
                reject({ code: 203, msg: "update error !" })
            }
        })
    })
}

async function createPhotoImpl(whereStr, updateStr) {
    return new Promise((resolv, reject) => {
        user.findOneAndUpdate(whereStr, updateStr, { new: true }).then(res => {
            resolv(res)
        })
    })
}

async function updatePhotoImpl(whereStr, updateStr, options) {
    return new Promise((resolv, reject) => {
        user.updateOne(whereStr, updateStr, options).then(res1 => {
            if (res1.ok == 1 && res1.n == 1) {
                user.find(whereStr).then(res2 => {
                    resolv(res2)
                })
            } else {
                reject({ code: 203, msg: "update error !" })
            }
        })
    })
}

module.exports = {
    SendEmailImpl,
    registerImpl,
    loginImpl,
    updateUserImpl,
    createPhotoImpl,
    updatePhotoImpl
}