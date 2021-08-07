module.exports = app => {
  const mongoose = require('mongoose')
  // 连接mangodb数据库
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
}  



 