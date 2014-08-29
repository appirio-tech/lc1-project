var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
           'CREATE TABLE challenges ( ' +
               'id integer NOT NULL, ' +
               '"regStartDate" timestamp with time zone, ' +
               '"subEndDate" timestamp with time zone, ' +
               'title character varying(128), ' +
               'type character varying(32), ' +
               'overview character varying(140), ' +
               'description text, ' +
               '"registeredDescription" text, ' +
               'tags text[], ' +
               '"createdAt" timestamp with time zone NOT NULL, ' +
               '"updatedAt" timestamp with time zone NOT NULL ' +
           ');'),
        db.runSql.bind(db,
            'CREATE SEQUENCE challenges_id_seq ' +
                'START WITH 1 ' +
                'INCREMENT BY 1 ' +
                'NO MINVALUE ' +
                'NO MAXVALUE ' +
                'CACHE 1;'),
        db.runSql.bind(db,"ALTER TABLE ONLY challenges ALTER COLUMN id SET DEFAULT nextval('challenges_id_seq'::regclass);"),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);')

    ], callback);
};

exports.down = function (db, callback) {
    db.dropTable('challenges', callback);
};
