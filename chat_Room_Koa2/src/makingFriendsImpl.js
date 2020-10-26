const user = require('../model/users')
const friend_request = require('../model/friend_request')
const friend_list = require('../model/friend_list')

async function searchEmailImpl(whereStr) {
    return new Promise((resolv, reject) => {
        user.find(whereStr).then(res => {
            console.log(res)
            if (res.length >= 1) {
                resolv(res[0])
            } else {
                reject({ code: 203, msg: "无此ID用户" })
            }
        })
    })
}

async function addRecordsImpl(insertStr) {
    return new Promise((resolv, reject) => {
        friend_request.findOneAndUpdate({ email: insertStr.email, openId: insertStr.openId, correlationId: insertStr.correlationId, replyTo: insertStr.replyTo },
            insertStr,
            { upsert: true, new: true, runValidators: true }).then(res => {
                console.log(res)
                if (res.errors == null) {
                    resolv({ code: 200, msg: "添加成功!" })
                } else {
                    reject({ code: 203, msg: "添加失败!" })
                }
            })
    })
}

async function findAddRecordsImpl(whereStr) {
    return new Promise((resolv, reject) => {
        friend_request.find(whereStr).then(res => {
            if (res.length > 0) {
                resolv(res)
            } else {
                reject({ code: 203, msg: "暂无好友添加记录" })
            }
        })
    })
}

async function refuseAddRecordsImpl(whereStr, updateStr) {
    return new Promise((resolv, reject) => {
        friend_request.updateOne(whereStr, updateStr).then(res => {
            if (res.n == 1 && res.ok == 1) {
                resolv({ code: 200, msg: "refuse success" })
            } else {
                reject({ code: 203, msg: "system error" })
            }
        })
    })
}

async function consentAddRecordsImpl(insertStr1, insertStr2, whereStr) {
    return new Promise((resolv, reject) => {
        var friend_lists = new friend_list(insertStr1);
        friend_lists.save(insertStr1).then(res1 => {
            if (res1.errors == null) {
                var friend_lists2 = new friend_list(insertStr2);
                friend_lists2.save(insertStr2).then(res2 => {
                    if (res2.errors == null) {
                        friend_request.updateOne(whereStr, { $set: { status: 1 } }).then(res3 => {
                            if (res3.n == 1 && res3.ok) {
                                resolv({ code: 200, msg: "add friend success" });
                            }
                        })
                    } else {
                        reject({ code: 203, msg: "add friend failing" });
                    }
                })
            } else {
                reject({ code: 203, msg: "add friend failing" });
            }
        })
    })
}

async function findByFriendListImpl(whereStr) {
    return new Promise((reoslv, reject) => {
        friend_list.find(whereStr, (err, res) => {
            if (err) {
                reject({ code: 203, msg: "System Error." + err })
            } else {
                reoslv(res)
            }
        })
    })
}

async function findByFriendInformatonImpl(whereStr) {
    return new Promise((resolv, reject) => {
        user.find(whereStr, (err, res) => {
            if (err) { reject({ code: 203, msg: "查无此人" }) };
            if (res.length >= 1) {
                resolv(res)
            }
        })
    })
}

async function updateFriendNoteImpl(whereStr, updateStr) {
    return new Promise((resolv, reject) => {
        friend_list.updateOne(whereStr, updateStr, (err, res) => {
            if (err) { reject({ code: 203, msg: "备注修改失败!" }) }
            if (res.ok == 1 && res.n == 1) {
                resolv({ code: 200, msg: "备注修改成功" })
            }
        })
    })
}

async function deleteFriendImpl(whereStr1, whereStr2) {
    return new Promise((resolv, reject) => {
        friend_list.deleteOne(whereStr1, (err1, res1) => {
            if (err1) reject({ code: 203, msg: "好友删除失败!" });
            console.log(res1);
            if (res1.ok == 1 && res1.n == 1) {
                friend_list.deleteOne(whereStr2, (err2, res2) => {
                    if (err2) reject({ code: 203, msg: "好友删除失败!" });
                    if (res2.ok == 1 && res2.n == 1) {
                        resolv({ code: 200, msg: "好友删除成功，删除好友对方好友列表里也会默认删除!" })
                    } else {
                        reject({ code: 203, msg: "好友删除失败!" });
                    }
                })
            } else {
                reject({ code: 203, msg: "好友删除失败!" });
            }
        })
    })
}

module.exports = {
    searchEmailImpl,
    addRecordsImpl,
    findAddRecordsImpl,
    refuseAddRecordsImpl,
    consentAddRecordsImpl,
    findByFriendListImpl,
    findByFriendInformatonImpl,
    updateFriendNoteImpl,
    deleteFriendImpl
}