const mongoose = require('mongoose');

// default to a 'localhost' configuration:
//var production = process.env.NODE_ENV == 'production';
let connection_string;
//var env = process.env;

//if ( production ) {
  //connection_string = env.OPENSHIFT_MONGODB_DB_URL + 'botslist';
//} else {
  connection_string = 'mongodb://127.0.0.1:27017/tg-chan';
//}

module.exports = {
  connect: function() {
    mongoose.connect(connection_string, { autoIndex: false, useNewUrlParser: true });

    return new Promise(function(resolve, reject) {
      mongoose.connection.on('error', reject);
      mongoose.connection.on('open', resolve);
    });
  }
};
