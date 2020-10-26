const friend_list = require("../model/friend_list")

async function pushMsghistoryImpl(whereStr1, whereStr2, updateStr) {
    return new Promise((resolv, reject) => {
        friend_list.updateOne(whereStr1, updateStr).then(res1 => {
            if (res1.ok == 1 && res1.n == 1) {
                friend_list.updateOne(whereStr2, updateStr).then(res2 => {
                    if (res2.ok == 1 && res2.n == 1) {
                        resolv({ code: 200, msg: "push success" })
                    } else {
                        reject("push failing")
                    }
                })
            } else {
                reject("push failing")
            }
        })
    })
}

async function clearChathistoryImpl(whereStr, updateStr) {
    return new Promise((resolv, reject) => {
        friend_list.updateOne(whereStr, updateStr, (err, res) => {
            if (err) reject({ code: 203, msg: "clear message failing" })
            if (res.ok == 1 && res.n == 1) {
                resolv({ code: 200, msg: "clear message success" })
            } else {
                reject({ code: 203, msg: "clear message failing" })
            }
        })
    })
}

module.exports = {
    pushMsghistoryImpl,
    clearChathistoryImpl
} 