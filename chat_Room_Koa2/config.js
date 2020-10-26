module.exports = {
    DB: {
        DBurl: "mongodb://localhost:27017/room",
        MONGOOSE_CONFIG: {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    },
    AMQP: {
        AMQPurl: "amqp://guest:guest@localhost:5672",//AMQP 连接地址,
        ExchangeName: "RoomMsgBox", //交换器名称
    },
    Email: {
        host: 'smtp.163.com',//邮箱服务的主机，如smtp.qq.com
        port: '465',//对应的端口号
        service: '163', //内置邮箱 163
        secureConnection: true, //是否使用了ssl证书验证
        user: '15908619974@163.com', //验证邮箱
        pass: 'GRVUFBWDPTGNIOTL',    //授权密码
        from: '15908619974@163.com', //发送者的邮箱
    },
    encrypt: {
        PWD_SECRET: "room@##15908619974@163.com", //登录密码 加密key
        JWT_SECRET: "romm@##nick_chen",           //用户登录token加密 key
        CTX_SECRET: "15567b09-88d2-45ba-9ddc-00314dde41a9", //聊天内容加密 key
    },
    prot: 3000, //服务端口
    socket_Namespace: "/Room", //socket连接具名


}