var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    openId: String,         //用户ID
    email: String,          //用户email
    username: String,       //username
    password: String,       //登录密码
    avatar: String,         //用户头像
    signature: String,      //个性签名
    genders: String,        //性别
    birthday: Date,         //生日  
    profession: String,     //职业
    city: Array,            //城市
    location: Array,        //经纬度位置(禁)
    photo_album: Array,     //相册
    createDate: { type: Date, default: Date.now }
}, { collection: 'users' })

userSchema.index({ "openId": 1, "email": 1 })

module.exports = mongoose.model('users', userSchema);