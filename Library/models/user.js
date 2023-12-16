const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', schema);
