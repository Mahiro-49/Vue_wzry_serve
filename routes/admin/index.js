const Category = require('../../models/Category');

module.exports = app => {
  const express = require('express');
  const AdminUser = require('../../models/AdminUser');
  const jwt = require('jsonwebtoken');
  const assert = require('http-assert')
  const router = express.Router({
    mergeParams: true

  });

  // 创建资源
  router.post('/', async (req, res) => {
    // 创建数据
    const model = await req.Model.create(req.body);
    // 发送回去给客户端 提示创建完成
    res.send(model)
  })

  // 通过识别id修改
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model)
  })

  // 删除分类数据
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true
    })
  })


  // 资源列表
  router.get('/', async (req, res) => {
    // 判断是否有Category字段 以此来显示上级分类
    const queryOption = {}
    if (req.Model.modelName === 'Category') {
      queryOption.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOption).limit(10)
    res.send(items)
  })

  // 资源详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 登陆校验中间件
  const authMiddleware = async (req, res, next) => {
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请先登录')
    const { id } = jwt.verify(token, app.get('secret'))
    assert(id, 401, '请先登录')
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登录')
    await next()
  }

  // 资源中间件
  const resourceMiddleware = async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }


  

  app.use('/admin/api/rest/:resource', authMiddleware , resourceMiddleware , router)


  // 资源路由
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })          //上传中间件
  app.post('/admin/api/upload', authMiddleware ,upload.single('file') ,async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // 登陆路由
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body       //解构赋值 接受前端传过来的model值
    // 1.根据用户名找用户
    const user = await AdminUser.findOne({ username }).select('+password')     //通过username到AdminUser中查找 只查找一个  select('+password')是因为AdminUser模型中用了select：false将密码隐藏了
    assert(user, 422, '用户不存在')

    // 2.检验密码
    const isValid = require('bcryptjs').compareSync(password, user.password);
    assert(isValid, 422, "密码错误")
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }

    // 3.返回token
    const token = jwt.sign({ id: user._id }, app.get('secret'));
    res.send({ token })
  })


  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}