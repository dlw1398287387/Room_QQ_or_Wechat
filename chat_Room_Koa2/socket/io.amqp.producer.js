const config = require('../config')
const jwt = require('jsonwebtoken')
const makingFriends = require('../controller/makingFriends')
const chat = require('../controller/chat')

async function apply_make_friends(channel, data, io, client) {
    //这里重新queue routingkey 避免发送消息对象queue里面没有消息自动删除。
    var queue = "queue#" + jwt.verify(data.correlationId, config.encrypt.JWT_SECRET)
    var routingKey = "routingKey_" + jwt.verify(data.correlationId, config.encrypt.JWT_SECRET)
    //关联消息队列 并设置当queue队列 无消息时自动删除
    let assert_ok = await channel.assertQueue(queue, { autoDelete: true, durable: false });
    //绑定 交换机 队列 routingKey 关系
    let bind_ok = await channel.bindQueue(queue, config.AMQP.ExchangeName, routingKey)
    var status = await channel.publish(config.AMQP.ExchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
        contentType: "application/json", deliveryMode: 2, replyTo: data.replyTo
    })
    //消息发送成功给发送消息的用户一个反馈。以便确认消息发送成功
    if (status) {
        console.log("发送请求消息：" + client.id)
        io.in(client.id).emit("cllback_apply_make_friends", { code: 200, msg: "send success" })
        //数据加入库
        makingFriends.addRecords(data)
    } else {
        io.in(client.id).emit("cllback_apply_make_friends", { code: 200, msg: "send failing" })
    }
}

async function sendMessage(channel, data, io, client) {
    console.log(data)
    //这里重新queue routingkey 避免发送消息对象queue里面没有消息自动删除。
    var queue = "queue#" + data.correlationId
    var routingKey = "routingKey_" + data.correlationId
    //关联消息队列 并设置当queue队列 无消息时自动删除
    let assert_ok = await channel.assertQueue(queue, { autoDelete: true, durable: false });
    //绑定 交换机 队列 routingKey 关系
    let bind_ok = await channel.bindQueue(queue, config.AMQP.ExchangeName, routingKey);
    var status = await channel.publish(config.AMQP.ExchangeName, routingKey, Buffer.from(JSON.stringify(data)), {
        contentType: "application/json", deliveryMode: 2, replyTo: data.replyTo
    })
    //消息发送成功给发送消息的用户一个反馈。以便确认消息发送成功
    if (status) {
        console.log("发送请求消息：" + client.id)
        io.in(client.id).emit("cllback_sendMessage", { code: 200, data: data.msgs, msg: "send success" })
        //数据加入库
        chat.pushMsghistory(data)
    } else {
        io.in(client.id).emit("cllback_sendMessage", { code: 200, msg: "send failing" })
    }
}

async function socket_event_producer(command, channel, data, io, client) {
    switch (command) {
        case "apply_make_friends":
            await apply_make_friends(channel, JSON.parse(data), io, client);
            break;
        case "sendMessage":
            await sendMessage(channel, JSON.parse(data), io, client);
            break;

    }
}

module.exports = {
    socket_event_producer
}