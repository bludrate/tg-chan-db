module.exports = ( messageContent ) => {
  const content = {
    type: messageContent._
  };

  switch( messageContent._ ) {
    case 'messageSticker':
      content.text = {
        text: messageContent.sticker.emoji
      };
      break;
    case 'messageAudio':
      content.text = messageContent.caption;
      content.audio = {
        title: messageContent.audio.title,
        duration: messageContent.audio.duration,
        performer: messageContent.audio.performer,
        fileName: messageContent.audio.file_name,
        mimeType: messageContent.audio.mime_type
      };
      break;
    case 'messagePhoto':
      const lastPhotoSize = messageContent.photo.sizes[ messageContent.photo.sizes.length - 1 ];
      content.aspectRatio = lastPhotoSize.height / lastPhotoSize.width;

      content.text = messageContent.caption;
      break;
    case 'messageDocument':
      content.text = messageContent.caption;
      content.document = {
        fileName: messageContent.document.file_name,
        mimeType: messageContent.document.mime_type,
        size: messageContent.document.document.size||messageContent.document.document.expected_size
      };
      break;
    case 'messageVideo':
      content.aspectRatio = messageContent.video.height / messageContent.video.width;
      content.isSecret = messageContent.is_secret;
      content.text = messageContent.caption;
      break;
    case 'messageAnimation':
      content.text = messageContent.caption;
      content.aspectRatio = messageContent.animation.height / messageContent.animation.width;
      break;
    case 'messageVoiceNote':
      content.text = messageContent.caption;
      break;
    case 'messageCustomServiceAction':
      content.text = messageContent.text;
      break;
    case 'messageLocation':
      content.location = messageContent.location;
      break;
    case 'messageText':
      content.text = messageContent.text;
      const wp = messageContent.web_page;
      if ( wp ) {
        content.webPage = {
          url: wp.url,
          display_url: wp.display_url,
          type: wp.type,
          siteName: wp.site_name,
          title: wp.title,
          description: wp.description,
          embedUrl: wp.embed_url,
          embedType: wp.embed_type,
          embedWidth: wp.embed_width,
          embedHeight: wp.embed_height,
          duration: wp.duration,
          author: wp.author
        };
      }
      break;
    case 'messageVideoNote':
      content.isSecret = messageContent.is_secret;
      break;
  }

  return content;
}
