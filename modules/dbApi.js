const controllerFactory = require('../models/controllerFactory');
const Post = require('../models/schemas/Post');
const Channel = require('../models/schemas/Channel');
const models = ['channel'];
const [channel] = models.map( m => controllerFactory.get( m ) );

async function getChannelWithPosts( channelUsername, postIndex ){
  const channelData = await channel.getOne({username: channelUsername});

  if ( !channelData ) {
    return null;
  }

  const postsQuery = { chatId: channelData.chatId };

  if ( postIndex ) {
    if ( isNaN(postIndex) ) {
      channelData.posts = [];
      return channelData;
    }
    postsQuery.postIndex = postIndex;
  }

  const posts = await getPosts({ query: postsQuery });

  channelData.posts = posts;

  return channelData;
}

async function getPosts( { query, limit = 0, sort = { date: 1 }, skip = 0 } ) {
  return await Post.find( query, null, { limit, sort, skip } );
}

async function getAllChannels() {
  return await Channel.find({}, null, { sort: { members: -1 } } );
}

module.exports = {
  getChannelWithPosts,
  getPosts,
  getAllChannels
};
