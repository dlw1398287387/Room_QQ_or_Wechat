const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koa_body = require('koa-body')

const user = require('./routes/user')
const files = require('./routes/files')
const friends = require('./routes/friends')
const chat = require('./routes/chat')
const circle = require('./routes/circle')
const auth_middleware = require('./middleware/auth_middleware')
const log_info = require('logger').createLogger('chat_room.log')

// error handler
onerror(app)
app.use(auth_middleware);
app.use(cors());

app.use(koa_body({
  multipart: true,
  formidable: {
    maxFileSize: 2 * 1024 * 1024
  }
}))

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  log_info.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(user.routes(), user.allowedMethods())
app.use(files.routes(), files.allowedMethods())
app.use(friends.routes(), friends.allowedMethods())
app.use(chat.routes(), chat.allowedMethods())
app.use(circle.routes(), circle.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

process.on('uncaughtException', function (err) {
  log_info.error('uncaughtException : ' + err);
  process.exit();
});
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});

var mongoose = require('mongoose');
var config = require('./config')
mongoose.set('useCreateIndex', true)
mongoose.connect(config.DB.DBurl, config.DB.MONGOOSE_CONFIG).then(() => {
  console.log("mongodb is connected");
  log_info.info("mongodb is connected")
}).catch(error => {
  console.log("mondb not connected");
  log_info.error("mongodb is connected" + error);
})
mongoose.connection.on('disconnected', () => {
  console.log('断开连接')
  mongoose.connect(config.DB.DBurl, config.DB.MONGOOSE_CONFIG).then(() => {
    console.log("Boot error restart ===》》》 mongodb is connected");
    log_info.info("Boot error restart ===》》》 mongodb is connected")
  }).catch(error => {
    console.log("Boot error restart ===》》》 mongodb is connected");
    log_info.error("Boot error restart ===》》》 mongodb is connected" + error);
  })
})


module.exports = app
