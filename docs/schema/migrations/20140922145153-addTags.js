var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,
      ' CREATE TABLE tags ( ' +
      ' id serial NOT NULL, ' +
      ' "name" character varying(32), ' +
      ' "tag_type" character varying(32), ' +
      ' "createdAt" timestamp with time zone NOT NULL,' +
      ' "updatedAt" timestamp with time zone NOT NULL,' +
      ' CONSTRAINT "tags_pkey" PRIMARY KEY (id));'
    )
  ], callback);
};

exports.down = function(db, callback) {

};


