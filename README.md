
# ![topcoder](http://www.topcoder.com/favicon.ico)  Project SERENITY: a refresh of the topcoder challenge lifecycle.

Major parts of this project are currently being developed  on the [MEAN.io framework](http://mean.io/)
but we have added support for PostgreSQL.  Documentation for MEAN.io can be found in the [MEAN.io doc directory] (http://mean.io/#!/docs) as well as the results of our first challenge
[PEAN.io prototype - MEAN with PostgreSQL support](http://www.topcoder.com/challenge-details/30045010) which should help you set up your environment as well as standup a [Heroku](heroku.com) instance.

This core uses the following modules in addition to the mean.io framework to support PostgreSQL.

 * [pg](https://www.npmjs.org/package/pg)
 * [Sequelize](http://sequelizejs.com)
 *  [postgresql-sequelize](https://www.npmjs.org/package/postgresql-sequelize)  a custom Sequelize adaptor that supports JSON and JSONB

 The following additions have been made to the default MEAN.io package.json to include the above dependencies
 ```
    "pg": "^3.4.1",
    "postgresql-sequelize": "0.0.5",
    "sequelize": "^1.7.9",
  ```

## Deadwood
For your convenience we have pre-configured the development config files with actual live databases hosted via Heroku.  We are collective referring to these two databases as **Deadwood**.
So you should be  able to run `npm install`  followed by `grunt` and see a live app with real data.  Please keep in mind you still need [PostgreSQL](http://www.postgresql.org/download/)
installed localy to run the app, since the npm install of pg will look for local pg bindings. The **Deadwood** databases are considered the wild west, and should be used at your own risk. If you are working
on a challenge that does **NOT** alter the model (i.e. a UI challenge) you are welcome to use **Deadwood**. However if you are working on a challenge that needs to alter either database you should switch to  local dbs.

## Switching to a local database and creating schema
The `NODE_ENV` var defines which database you use. We have added `config/env/local.js` to the gitignore so if you create this file it wont be commited and you can secure you local db credentials. To switch to local do the following:

1. copy `config/env/development.js` to `config/env/local.js`.
1. edit this new file and add you db string for mongo and postgres.
1. create the local postgres db
1. from you shell run `grunt local` and start your app.

We have been playing with the sequelize feature that creates the tables for you when the app is started so at any given time this feature may be off.  That being said you may need to create the tables in postgres first. You eventually will  find a script to do this in the docs or you can run pg_dump on the **Deadwood** database to get the schema.  The credentials are found in the `config/env/development.js` config file, you have admin access to this database so please be respectful.
