const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  article: String,
  body: String,
});

const articleModel = mongoose.model('article', Schema, 'article');

module.exports = articleModel;