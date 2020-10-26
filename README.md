Chat_Room
====

Overview
----
前端UI库：https://youzan.github.io/vant/#/zh-CN/

![首页](http://chat.mychen.vip/home.png)

![好友列表](http://chat.mychen.vip/friends.png)

![胖友圈](http://chat.mychen.vip/circle.png)

![用户中心](http://chat.mychen.vip/userTab.png)

![用户资料](http://chat.mychen.vip/userInfos.png)

![用户相册](http://chat.mychen.vip/photo.png)

![好友信息](http://chat.mychen.vip/friend_infomations.png)

![添加好友](http://chat.mychen.vip/audit.png)

![添加好友](http://chat.mychen.vip/chat_room.png)

![登录页](http://chat.mychen.vip/login.png)




项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/dlw1398287387/Room_QQ_or_Wechat.git
cd /Room_QQ_or_Wechat/chat_Room_vue
```


- 安装依赖
```
cnpm install
```

- 开发模式运行
```
cnpm run dev
```

- 编译项目
```
npm run build
```

- nginx图片代理
```
    server{
        listen  9999;
        server_name  localhost;
        location ~ .*\.(gif|jpg|jpeg|png)$ {
            root   ..\chat_Room_Koa2\public\images;
            expires -1; 
            # proxy_pass  http://mychen.vip;
	    }     
    }
```

- Node.js代码启动/bin/www 文件。
```
pm2 start '安装路径'/chat_Room_Koa2/bin/www
```
