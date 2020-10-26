const router = require('koa-router')(
    { prefix: "/v1/api/circle" }
)

const circle = require('../controller/circle')

router.post('/addCircle', circle.addCircle)

router.get('/findByfriendCircle', circle.findByfriendCircle)

router.get('/findByMeCircle', circle.findByMeCircle)
module.exports = router