const KafkaClient = require('../../tg-chan-kafka');
const controllerFactory = require( '../models/controllerFactory' );
const processPost = require('./processPost');
const processContent = require('./processContent');

const post = controllerFactory.get('post');
const channel = controllerFactory.get('channel');
const Post = require('../models/schemas/Post');

const topics = [
  'updateNewMessage',
  'updateNewMessages',
  'updateDeleteMessages',
  'updateChatTitle',
  'updateMessageContent',
  'updateMessageEdited',
  'newChannelWebData',
  'newChannelWithId',
  'postWebData'
];

module.exports = () => {
  return new KafkaClient().then( async kafkaClient => {
    const producer = await kafkaClient.producer;

    kafkaClient.subscribe( topics, ( message ) => {
      const data = JSON.parse(message.value);

      switch ( message.topic ) {
        case 'postWebData':
          const { chatId, messageId, ...webData } = data;
          Post.findOne({ chatId: chatId, messageId: messageId }).then( post => {
            if ( post ) {
              Object.assign( post.content, webData );
              post.markModified('content');
              return post.save();
            }
          } ).then(() => {}, console.log);
          break;
        case 'newChannelWebData':
          const { username, ...channelWebData } = data;
          channel.put( { username: username }, { $set: channelWebData } ).then(() => {
            producer.send( [ {
              topic: 'channelUpdateReady',
              messages: JSON.stringify({username})
            } ], ( err, data ) => {
              err && console.log( err );
            } );
          }, console.log);
          break;
        case 'newChannelWithId':
          channel.post({
            username: data.username,
            chatId: data.chatId
          }).then(() => {}, console.log);
          break;
        case 'updateChatTitle':
          channel.put({chatId: data.chat_id}, {$set: { title: data.title}}).then( async () => {
            const channel = await channel.getOne({chatId: data.chat_id});

            if ( !channel ) {
              return ;
            }

            producer.send( [ {
              topic: 'channelUpdateReady',
              messages: JSON.stringify({username: channel.username})
            } ], ( err, data ) => {
              err && console.log( err );
            } );
          }, console.log );
          break;
        case 'updateMessageContent':
          post.put({ chatId: data.chat_id, messageId: data.message_id }, { $set: { content: processContent( data.new_content )}}).then( async () => {
            const _post = await post.getOne({
              chatId: data.chat_id,
              messageId: data.message_id
            });

            if ( !_post ) {
              return ;
            }

            producer.send( [ {
              topic: 'postUpdateReady',
              messages: JSON.stringify({link: _post.link})
            } ], ( err, data ) => {
              err && console.log( err );
            } );
          }, console.log );
          break;
        case 'updateMessageEdited':
          post.put({ chatId: data.chat_id, messageId: data.message_id }, { $set: { editDate: data.edit_date, replyMarkup: data.reply_markup}}).then( async () => {
            const _post = await post.getOne({
              chatId: data.chat_id,
              messageId: data.message_id
            });

            if ( !_post ) {
              return ;
            }

            producer.send( [ {
              topic: 'postUpdateReady',
              messages: JSON.stringify({link:_post.link})
            } ], ( err, data ) => {
              err && console.log( err );
            } );
          }, console.log);
          break;
        case 'updateNewMessages':
          data.forEach( message => {
            const newPost = processPost(message);

            if ( newPost ) {
              post.post( newPost ).then(( {link} ) => {
                producer.send( [ {
                  topic: 'postUpdateReady',
                  messages: JSON.stringify({link})
                } ], ( err, data ) => {
                  err && console.log( err );
                } );
              }, console.log);
            }
          } )
          break;
        case 'updateNewMessage':
          const newPost = processPost(data.message);

          if ( newPost ) {
            post.post( newPost ).then(({link}) => {
              producer.send( [ {
                topic: 'postUpdateReady',
                messages: JSON.stringify({link})
              } ], ( err, data ) => {
                err && console.log( err );
              } );
            }, console.log);
          }
          break;
        case 'updateDeleteMessages':
          post.put({ chatId: data.chat_id, messageId: {$in: data.message_ids} }, { $set: { deleted: data.date }}).then(async () => {
            const posts = await post.get({ chatId: data.chat_id, messageId: {$in: data.message_ids} });

            if ( !posts || !posts.length ) {
              return ;
            }

            posts.forEach( ({link}) => {
              producer.send( [ {
                topic: 'postUpdateReady',
                messages: JSON.stringify({link})
              } ], ( err, data ) => {
                err && console.log( err );
              } );
            } );
          }, console.log);
          break;
      }
    } );
  } );
}
