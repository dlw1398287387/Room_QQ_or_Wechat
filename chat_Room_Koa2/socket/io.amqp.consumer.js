const config = require('../config')
const jwt = require('jsonwebtoken')

async function apply_make_friends(data, io, client) {
    console.log("获取请求消息：" + client.id)
    io.to(client.id).emit('get_apply_make_friends_msg', '您有一个好友添加申请')
}

async function sendMessage(data, io, client) {
    console.log(data);
    io.to(client.id).emit('get_sendMessage_msg', data.msgs)
}

async function socket_event_consumer(command, data, io, client) {
    switch (command) {
        case "apply_make_friends":
            await apply_make_friends(data, io, client);
            break;
        case "sendMessage":
            await sendMessage(data, io, client);
            break;
    }
}

module.exports = {
    socket_event_consumer
}