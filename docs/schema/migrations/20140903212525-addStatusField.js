var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('challenges', 'status', { type: 'string', defaultValue: 'draft' }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('requirements', callback);
};
