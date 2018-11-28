const mongooseModels = require('./schemas');
const Controller = require('./controller');

class Factory {
  constructor( models ) {
    this.models = {};

    for ( let model in models ) {
      this.models[ model.toLowerCase() ] = new Controller( models[ model ] );
    }
  }

  get( modelName ) {
    return this.models[ modelName ];
  }
}

module.exports = new Factory( mongooseModels );
