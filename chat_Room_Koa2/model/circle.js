const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var circleSchema = new Schema({
    openId: String,
    username: String,
    avatar: String,
    message: String,
    illustration: Array,
    createTime: { type: Date, default: Date.now }
})

circleSchema.index({ openId: 1 });

module.exports = mongoose.model('circle', circleSchema);
