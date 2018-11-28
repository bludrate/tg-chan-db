const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ChannelSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  chatId: {
    type: Number
  },
  title: String,
  info: String,
  avatar: String,
  members: Number,
  pinnedMessage: Number
});

ChannelSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Channel', ChannelSchema);
