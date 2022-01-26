const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  keyword: String,
  tags: Array,
});

const keywordsModel = mongoose.model('keywords', Schema, 'keywords');

module.exports = keywordsModel;