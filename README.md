
# This is the core repo for project SERENITY: a topcoder re-write on the MEAN stack.  

Currently this project is built on the [MEAN.io framework](http://mean.io/)
but we have added support for PostgreSQL.  The readme for MEAN.io can be found in the doc directory as well as the results of our first challenge
[PEAN.io prototype - MEAN with PostgreSQL support](http://www.topcoder.com/challenge-details/30045010) which should help you set up you environment as well as standup a [Heroku](heroku.com) instance.

This core uses the following modules in addtion to the mean.io framework

 * [pg](https://www.npmjs.org/package/pg)
 * [Sequelize](http://sequelizejs.com)
 *  [postgresql-sequelize](https://www.npmjs.org/package/postgresql-sequelize)  a custom Sequelize adaptor that supports JSON and JSONB

 The following additions can be made to the mean.io package.json to include the above dependcies
 ```
    "pg": "^3.4.1",
    "postgresql-sequelize": "0.0.4",
    "sequelize": "^1.7.9",
  ```
