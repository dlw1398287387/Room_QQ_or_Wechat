const router = require('koa-router')(
    { prefix: "/v1/api/friends" }
)

const Friends = require('../controller/makingFriends')

//搜索email
router.post('/searchEmail', Friends.searchEmail)

//查询好友添加记录
router.get('/findAddRecords', Friends.findAddRecords)

//拒绝添加好友申请
router.post('/refuseAddRecordsImpl', Friends.refuseAddRecords)

//同意添加好友申请
router.post('/consentAddRecords', Friends.consentAddRecords)

//查询好友列表
router.get('/findByFriendList', Friends.findByFriendList)

//查询好友信息
router.post('/findByFriendInformaton', Friends.findByFriendInformaton)

//修改好友备注
router.put('/updateFriendNote', Friends.updateFriendNote)

//删除好友
router.delete('/deleteFriend', Friends.deleteFriend)

module.exports = router