const circle = require('../model/circle');
const friend_list = require('../model/friend_list');

async function addCircleImpl(insertStr) {
    return new Promise((resolv, reject) => {
        var circles = new circle(insertStr);
        circles.save(insertStr, (err, res) => {
            if (err) reject({ code: 203, msg: "Save Failing" })
            if (res.errors == null) {
                resolv({ code: 200, msg: "Save success" })
            } else {
                reject({ code: 203, msg: "Save Failing" })
            }
        })
    })
}


async function findByfriendCircleImpl(whereStr) {
    return new Promise((resolv, reject) => {
        friend_list.aggregate(whereStr, (err, res) => {
            console.log(res);
            if (err) reject({ code: 200, msg: "Find Failing" })
            if (res.length >= 1) {
                resolv(res);
            } else {
                reject({ code: 200, msg: "Find Failing" })
            }
        })
    })
}

async function findByMeCircleImpl(whereStr) {
    return new Promise((resolv, reject) => {
        circle.find(whereStr, (err, res) => {
            if (err) reject({ code: 200, msg: "Find Failing" })
            if (res.length >= 1) {
                resolv(res);
            } else {
                reject({ code: 200, msg: "Find Failing" })
            }
        })
    })
}

module.exports = {
    addCircleImpl,
    findByfriendCircleImpl,
    findByMeCircleImpl
}



