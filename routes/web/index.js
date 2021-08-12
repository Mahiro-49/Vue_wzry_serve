// 前端路由
module.exports = app => {
  const router = require('express').Router()
  // const Article = require('../../models/Article')
  const mongoose = require('mongoose')
  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.find().where({
      parent: parent
    }).lean()
    const newsTitle = ["狄某有话说 | 女娲，补补队友掉的星星吧！", "公孙离-祈雪灵祝海报优化过程展示&amp;貂蝉-金色仲夏夜大招优化过程展示【老亚瑟答疑】", "周年庆表现道具设计大赛首轮投票开启~", "【第三期】周年庆表现道具设计大赛精彩创意分享", "貂蝉暖手充电宝设计方案票选结果公布", "8月12日全服不停机更新公告", "8月13日体验服停机更新公告", "8月11日净化游戏环境声明及处罚公告", "8月11日“演员”惩罚名单", "8月11日外挂专项打击公告", "【锦绣七夕】活动开启公告", "金风玉露一相逢，峡谷七夕情意浓", "互动小任务第11期-貂蝉暖手充电宝设计方案票选开启！", "盛夏炎炎峡谷齐欢畅，小青龙为你送清凉", "蔷薇恋人设计稿方案票选活动结果公布", "一图get第四届全国大赛四条赛道奖励合集", "全国大赛竟成辅助噩梦？人类高质量整活行为大赏！", "零门槛当电竞选手！一图带你玩转全国大赛游戏赛道！", "第四届全国大赛来啦！想成为电竞选手，你一定要知道这三件事！", "王者荣耀全国大赛走进武汉，电竞与城市的命题究竟有多少解法?"]
    const newsList = newsTitle.map(title => {
      // 随机拿数据
      const randomCars = cats.slice(0).sort((a,b) => Math.random() - 0.5)
      
      return {
        categories: randomCars.slice(0, 2),
        title: title
      }
    })
    await Article.deleteMany({})
    await Article.insertMany(newsList)
    res.send(newsList)

  })

  app.use('/web/api', router)
}