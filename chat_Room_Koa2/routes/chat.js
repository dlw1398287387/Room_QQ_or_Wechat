const router = require('koa-router')(
    { prefix: "/v1/api/chat" }
)

const chat = require('../controller/chat')
const gridfs = require('../controller/gridfs')

router.put('/clearChathistory', chat.clearChathistory)

router.post('/uploads', gridfs.uploadFile)

router.get('/findFiles/:filename', gridfs.findFiles)

router.post('/download/:filename', gridfs.download)

router.delete('/deleteFile/:filename', gridfs.deleteFile)

module.exports = router