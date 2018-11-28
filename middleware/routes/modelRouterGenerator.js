const controllerFactory = require( '../../models/controllerFactory' );

module.exports = ( modelName, router, koaBody ) => {
  const model = controllerFactory.get( modelName );

  router
    .get('/' + modelName, async (ctx, next) => {
        ctx.body = await model.get(ctx.request.query);
    })
    .get('/' + modelName + '/:id', async (ctx, next) => {
        await model.get({_id: ctx.params.id }).then( result => {
          ctx.body = result;
        } )
        .catch( error => {
          ctx.body = error;
        } )
        .finally( next );
    })
    .post('/' + modelName, koaBody, async (ctx, next) => {
        ctx.body = await model.post( ctx.request.body );
    })
    .put('/' + modelName + '/:id', koaBody, async (ctx, next) => {
        ctx.body = await model.put( { _id: ctx.params.id }, ctx.request.body );
    })
    .delete('/' + modelName + '/:id', async (ctx, next) => {
        ctx.body = await model.delete({ _id: ctx.params.id });
    });
};
