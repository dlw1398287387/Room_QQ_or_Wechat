var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var friend_listSchema = new Schema({
    openId: String,
    friendId: String,
    avatar: String,
    username: String,
    signature: String,
    note: String,
    msgs: Array,
    li: String
}, { collection: 'friend_list' })

friend_listSchema.index({ openId: 1 })

module.exports = mongoose.model('friend_listSchema', friend_listSchema);