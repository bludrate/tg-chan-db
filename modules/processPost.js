const processContent = require('./processContent');

const notAllowedContentTypes = [
  'messageSupergroupChatCreate',
  'messageChatChangePhoto'
];

module.exports = ( message ) => {
  if ( notAllowedContentTypes.indexOf( message.content._) !== -1 ) {
    return null;
  }

  let replyMarkup = message.reply_markup;


  if ( !replyMarkup || replyMarkup._ !== 'replyMarkupInlineKeyboard' ) {
    replyMarkup = undefined;
  }

  return {
    messageId: message.id,
    chatId: message.chat_id,
    date: message.date,
    editDate: message.edit_date,
    replyToMessageId: message.reply_to_message_id,
    views: message.views,
    deleted: false,
    signature: message.author_signature,
    content: processContent( message.content ),
    link: message.link,
    replyMarkup,
    forwardInfo: message.forward_info,
    mediaAlbumId: message.media_album_id
  };
}
