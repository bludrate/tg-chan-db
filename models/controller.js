const mongoose = require('mongoose');
class Controller {
  constructor( Model ) {
    this.Model = Model;
  }

  post( data ) {
    return new this.Model( data ).save();
  }

  delete( data ) {
    return this.Model.remove( data );
  }

  put( query, data ) {
    return this.Model.updateMany( query, data );
  }

  get( query ) {
    if ( query._id && !mongoose.Types.ObjectId.isValid(query._id) ) {
      return Promise.reject('Invalid object id');
    }

    return this.Model.find( query ).then( models => {
      return models.map( m=> m && m.toObject() );
    })
  }

  getOne( query ) {
    if ( query._id && !mongoose.Types.ObjectId.isValid(query._id) ) {
      return Promise.reject('Invalid object id');
    }

    return this.Model.findOne( query ).then( model => {
      return model && model.toObject();
    })
  }
}

module.exports = Controller;
