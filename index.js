const db = require('./modules/db');
const Koa = require('koa');
const { routes, allowedMethods } = require('./middleware/routes');
const listenToMessages = require('./modules/listenToMessages');

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  await next();
});
app.use(routes());
app.use(allowedMethods());

db.connect().then(() => {
  listenToMessages();
  app.listen(3333, function () {
    console.log( 'app: 3333' );
  });
});
