var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friend_requestSchema = new Schema({
    openId: String,         //用户ID
    replyTo: String,        //用户ID
    correlationId: String,  //添加对象ID
    command: String,        //命令
    email: String,          //用户email
    username: String,       //username
    avatar: String,         //用户头像
    signature: String,      //个性签名
    genders: String,        //性别
    birthday: Date,         //生日  
    profession: String,     //职业
    city: Array,            //城市
    status: Number,         //状态
    location: Array,        //经纬度位置(禁)
    photo_album: Array,     //相册
    createDate: { type: Date, default: Date.now }
}, { collection: 'friend_request' })

friend_requestSchema.index({ "email": 1 })

module.exports = mongoose.model('friend_request', friend_requestSchema);