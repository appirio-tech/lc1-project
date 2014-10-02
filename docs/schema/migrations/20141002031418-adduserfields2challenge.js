var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('challenges', 'updatedBy', { type: 'character varying(64)' }, addCreatedBy);

  function addCreatedBy(err) {
    if (err) {callback(err); return; }
    db.addColumn('challenges', 'createdBy', { type: 'character varying(64)' }, callback);
  }


};

exports.down = function(db, callback) {

};
