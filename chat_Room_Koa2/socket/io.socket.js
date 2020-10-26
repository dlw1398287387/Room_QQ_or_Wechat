const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require('logger').createLogger('chat_room.log');
const producer = require('../socket/io.amqp.producer')
const consumer = require('../socket/io.amqp.consumer')


function connections(io, amqp) {
    return async function (client) {
        // console.log(io)
        console.log("连接" + client.id)
        var channel = {}
        //解决调用参数promise 问题
        await amqp.then(res => { channel = res })
        var uuid = client.handshake.query.Uid
        //判断socket连接携带参数是否为空，
        if (uuid != null && uuid != "") {
            var queue = "queue#" + jwt.verify(uuid, config.encrypt.JWT_SECRET)
            var routingKey = "routingKey_" + jwt.verify(uuid, config.encrypt.JWT_SECRET)
            //关联消息队列 并设置当queue队列 无消息时自动删除
            let assert_ok = await channel.assertQueue(queue, { autoDelete: true, durable: false });
            //绑定 交换机 队列 routingKey 关系
            let bind_ok = await channel.bindQueue(queue, config.AMQP.ExchangeName, routingKey)
            //公平调度
            await channel.prefetch(1, false)
            //消费消息
            if (bind_ok) {
                await channel.consume(queue, amqp_consumer(), { noAck: false });
            } else {
                console.log("强制断开连接")
                client.disconnect();
            }

            //消费消息队列里的消息
            function amqp_consumer() {
                return async function (msg) {
                    await consumer.socket_event_consumer(JSON.parse(msg.content.toString()).command, JSON.parse(msg.content.toString()), io, client);
                    await channel.ack(msg);
                }
            }
        } else {//不携带参数直接断开连接
            console.log("强制断开连接")
            client.disconnect();
        }

        //添加好友
        client.on("apply_make_friends", data => {
            producer.socket_event_producer("apply_make_friends", channel, data, io, client)
        })

        //发送消息
        client.on("sendMessage", data => {
            producer.socket_event_producer("sendMessage", channel, data, io, client)
        })

        // 监听用户断开socket连接
        client.on("disconnect", obj => {
            // console.log(obj);
            client.disconnect();
            console.log(client.id + "**************断开socket连接*******************")
        })
    }
}




module.exports = {
    connections
}
