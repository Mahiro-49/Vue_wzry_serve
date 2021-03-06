const express = require('express');

const app = express();
 

app.set('secret', '132ad15a')  //全局设置一个secret变量

// 设置中间件 引用跨域模块
app.use(require('cors')())
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/uploads'))

require('./routes/admin')(app)
require('./plugins/db')(app)
require('./routes/web')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000');
})