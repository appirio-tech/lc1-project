var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,
      ' CREATE TABLE accounts ( ' +
      ' id serial NOT NULL, ' +
      ' "accountId" character varying(32), ' +
      ' "name" character varying(32), ' +
      ' "createdAt" timestamp with time zone NOT NULL,' +
      ' "updatedAt" timestamp with time zone NOT NULL,' +
      ' CONSTRAINT "accounts_pkey" PRIMARY KEY ("accountId"));'
    ),
    db.addColumn('challenges', 'accountId', { type: 'string', length: 32 }, callback)
  ], callback);
};

exports.down = function(db, callback) {
  db.dropTable('accounts', callback);
};

