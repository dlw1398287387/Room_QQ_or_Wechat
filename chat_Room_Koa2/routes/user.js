const router = require('koa-router')(
    { prefix: "/v1/api/user" }
)

const user = require('../controller/user')

//send email code 
router.post('/sendAuth_codes', user.SendEmail)
//register
router.post('/register', user.register)
//login
router.post('/login', user.login)
//update user 
router.put('/users', user.updateUser)
//create user photo 
router.post('/photo', user.createPhoto)
//update user photo 
router.put('/photo', user.updatePhoto)
//delete user item photo  
router.post('/deleteDhoto', user.deletePhotoItem)
module.exports = router