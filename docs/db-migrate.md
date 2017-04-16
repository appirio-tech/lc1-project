# bryce's change

#db migration

the db migration is done via `db-migrate` and `grunt-db-migrate`.
video demo available at http://youtu.be/Odw6YHCFDfw


## File structure

```
\database.json      # defines the database env
\---schema
    \---migrations  # all scripts are here
            20140826112659-baseline.js
```


## grunt config
A task called `dbmigrate` is registered in the gruntfile.
The task basically just runs `db-migrate up` command with property parameters.

A new config `migrate` is added to grunt as well where defines the parameters for the `db-migrate`.
For more info, refer to the inline comment.


## create new migration script

```
> grunt migrate:create:test


Running "migrate:create:test" (migrate) task
[INFO] Created migration at docs\schema\migrations\20140827043616-test.js
```


## run the migration scripts

```
> grunt local


...
Running "dbmigrate" task

Running "migrate:up" (migrate) task
[INFO] Using urlConfig settings: { driver: 'postgres',
user: 'postgres',
password: 'root',
database: 'serenity',
host: 'localhost',
port: '5432' }
[INFO] require: ./postgres
[INFO] connecting
[INFO] connected
[SQL] select version() as version
[SQL] SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'migrations'
[INFO] creating table: migrations
[SQL] CREATE TABLE IF NOT EXISTS migrations ("id"   SERIAL PRIMARY KEY NOT NULL, "name" VARCHAR (255) NOT NULL, "run_on" TIMESTAMP  NOT NULL)
[INFO] migration table created
[INFO] loading migrations from dir E:\projects\tc\serenity\docs\schema\migrations
[INFO] loading migrations from database
[INFO] preparing to run up migration: 20140826112659-baseline
[SQL] BEGIN;
[SQL] CREATE TABLE challenges ( id integer NOT NULL, "regStartDate" timestamp with time zone, "subEndDate" timestamp with time zone, title character varying(128), type character varying(32), overview character varying(140), description text, "registeredDescription" text, tags text[], "createdAt" timestamp with time zone NOT NULL, "updatedAt" timestamp with time zone NOT NULL );
[SQL] CREATE SEQUENCE challenges_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
[SQL] INSERT INTO migrations (name, run_on) VALUES ($1, $2) [ [ '20140826112659-baseline',
  Wed Aug 27 2014 14:41:01 GMT+1000 (AUS Eastern Standard Time) ] ]
[INFO] Processed migration 20140826112659-baseline
[SQL] COMMIT;
[INFO] Done
...
```