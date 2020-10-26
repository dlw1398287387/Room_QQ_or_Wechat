var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var auth_sessionSchema = new Schema({
    email: String,
    auth_code: String,
    expiredDate: { type: Date, default: new Date(new Date().setMinutes(new Date().getMinutes() + 5)) },
    createDate: { type: Date, default: Date.now }
}, { collection: 'auth_session' })

auth_sessionSchema.index({ "expiredDate": 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('auth_session', auth_sessionSchema);