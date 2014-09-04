var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,
      'CREATE TABLE challenge_registrants ( ' +
      'id serial NOT NULL, ' +
      '"createdAt" timestamp with time zone NOT NULL, ' +
      '"updatedAt" timestamp with time zone NOT NULL, ' +
      '"challengeId" integer, ' +
      '"userId" character varying(32), ' +
      'CONSTRAINT challenge_registrants_pkey PRIMARY KEY (id) );'
    )
  ], callback);

};

exports.down = function(db, callback) {
  db.dropTable('challenge_registrants', callback);
};
