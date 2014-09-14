var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
	async.series([
    db.runSql.bind(db,
      ' CREATE TABLE files ( ' +
			' id serial NOT NULL, ' +
			' title text, ' +
			' "filePath" text, ' +
			' "tempPath" text, ' +
			' size bigint, ' +
			' "fileName" text, ' +
			' "storageType" integer, ' +
			' "createdAt" timestamp with time zone NOT NULL, ' +
			' "updatedAt" timestamp with time zone NOT NULL, ' +
			' "challengeId" INTEGER REFERENCES "challenges" ("id") ON DELETE SET NULL ON UPDATE CASCADE, ' +
			' CONSTRAINT "files_pkey" PRIMARY KEY (id));'
    )
  ], callback);
};

exports.down = function(db, callback) {
	db.dropTable('files', callback);
};
