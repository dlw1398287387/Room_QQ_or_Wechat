const router = require('koa-router')(
    { prefix: "/v1/api/files" }
)
const files = require('../controller/files')
//登录
router.post('/fileUpload', files.fileUpload)

module.exports = router