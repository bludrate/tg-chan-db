const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const PostSchema = mongoose.Schema({
  chatId: {
    type: Number,
    requried: true
  },
  messageId: {
    type: Number,
    required: true
  },
  postIndex: Number,
  date: Number,
  editDate: Number,
  forwardInfo: Object,
  replyToMessageId: Number,
  views: Number,
  deleted: Number,
  signature: String,
  link: String,
  content: Object,
  replyMarkup: Object,
  mediaAlbumId: String
});

PostSchema.pre('save', function(next) {
  const post = this;

  if ( !post.postIndex && post.link ) {
    post.postIndex = Number( post.link.match(/\d*$/)[0] );
  }

  next();
} );

PostSchema.index({ messageId: 1, chatId: 1 }, {unique: true});

PostSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', PostSchema);
