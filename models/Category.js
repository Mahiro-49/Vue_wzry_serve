const mongoose = require('mongoose');

// 定义模型字段
const schema = new mongoose.Schema({
  name: { type: String },
  parent: {type: mongoose.SchemaTypes.ObjectId, ref:"Category"}
});

module.exports = mongoose.model('Category', schema)