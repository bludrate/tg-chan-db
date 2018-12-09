const Router = require('koa-router');
const KoaBody = require('koa-body');
//const modelRouterGenerator = require('./modelRouterGenerator');
const dbApi = require('../../modules/dbApi');

//const models = ['post', 'channel'];
const router = new Router();
const koaBody = KoaBody();

//models.forEach( m => modelRouterGenerator(m, router, koaBody) );

router.get('/channel', async( ctx, next ) => {
  ctx.body = await dbApi.getAllChannels();
} );

router.get('/post', async( ctx, next ) => {
  const data = {
    query: {},
    limit: 0,
    sort: {}
  };

  if ( ctx.query.page ) {
    const page = (ctx.query.page && ctx.query.page) - 1;
    const perPage = 100;
    data.limit = perPage;
    data.skip = perPage * page;
  }

  if ( ctx.query.chatId ) {
    data.query.chatId = ctx.query.chatId;
  }

  ctx.body = await dbApi.getPosts(data);
} );

router.get('/channelWithPosts/:channelUsername', async ( ctx, next ) => {
  const channel = await dbApi.getChannelWithPosts( ctx.params.channelUsername );

  if ( !channel ) {
    return ctx.status = 404;
  }

  ctx.body = channel;
});

router.get('/channelWithPosts/:channelUsername/:postIndex', async ( ctx, next ) => {
  const channel = await dbApi.getChannelWithPosts( ctx.params.channelUsername, ctx.params.postIndex );

  if ( !channel ) {
    return ctx.status = 404;
  }

  ctx.body = channel;
} );

function routes () { return router.routes() }
function allowedMethods () { return router.allowedMethods() }

module.exports = {
  routes,
  allowedMethods
}
