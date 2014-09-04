var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
      db.runSql.bind(db,
         "CREATE TYPE requirement_neccesity AS ENUM ( 'Must', 'Should', 'Nice', 'Optional');"),
      db.runSql.bind(db,
          "CREATE TYPE requirement_type AS ENUM ( 'Functional', 'Technical', 'Informational', 'Other' );"),
      db.runSql.bind(db,
        'CREATE TABLE requirements (' +
        'id serial NOT NULL,' +
        'type requirement_type,' +
        'necessity requirement_neccesity,' +
        'body text NOT NULL,' +
        'score_min integer NOT NULL,' +
        'score_max integer NOT NULL,' +
        'created_by_user_id integer NOT NULL,' +
        'is_private boolean NOT NULL DEFAULT true,' +
        'difficulty integer,' +
        'tags text[],' +
        'textsearchable_body tsvector,' +
        'is_in_library boolean NOT NULL DEFAULT false,' +
        'weight numeric(5,3) NOT NULL,' +
        '"createdAt" timestamp with time zone NOT NULL,' +
        '"updatedAt" timestamp with time zone NOT NULL,' +
        'CONSTRAINT requirements_pkey PRIMARY KEY (id) );'),
      db.runSql.bind(db,
        'CREATE TABLE challenge_requirements ( ' +
        'id serial NOT NULL, ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"challengeId" integer, ' +
        '"requirementId" integer, ' +
        'CONSTRAINT challenge_requirements_pkey PRIMARY KEY (id) );'
        )

  ], callback);

};

exports.down = function(db, callback) {
  db.dropTable('requirements', callback);
  db.dropTable('challenge_requirements', callback);

};
