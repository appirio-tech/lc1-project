var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('challenge_registrants', 'role', { type: 'character varying(32)' }, addHandle);

  function addHandle(err) {
    if (err) {callback(err); return; }
    db.addColumn('challenge_registrants', 'handle', { type: 'character varying(32)' }, callback);
  }


};

exports.down = function(db, callback) {

};
