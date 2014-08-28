# [[serenity] karma and mocha testing](http://community.topcoder.com/tc?module=ProjectDetail&pj=30045305)



Implemented Challenge model testing with `mocha` and client-side Challenges controller testing with `karma`.


## App Demo Screencast

[Test in action screencast](https://www.youtube.com/watch?v=X6T65j3uriU)

## Configuration

Please copy `config/env/development.js` to `config/env/test.js`, configure the MongoDB and PostgreSQL for test environment to the `config/env/test.js`.

Create `mean_test` database in the PostgreSQL by using PgAdmin3. If `mean_test` database already exists, please delete all data before testing by right click the `challenges` table and select ***Truncate Cascaded*** in the PgAdmin3.

The sample configuration for test environment:

	{
	  db: 'mongodb://localhost/mean-test',
		.....
	  pg: {
	    dialect: 'postgres',
	    database: 'mean_test',
	    username: 'postgres',
	    password: '',
	    host: 'localhost',
	    port: 5432
	  }
	}


## Running Test

Please make sure `MongoDB` and `PostgreSQL` are running for test DBs.


Unzip the project zip file:

    $ unzip serenity-core-test.zip
    $ cd serenity-core-test

Install modules:

    $ npm install

The test starts the application by itself, ***please don't run the app during the test***.

To run all tests:

    $ grunt test


To run mocha tests only:

	$ export NODE_ENV=test		// only needs once in the console
	$ grunt mochaTest

Mocha test results:

    Model Challenge:
      Method Save
        ✓ should be able to save without problems
        ✓ should fail when try to save a title of more than 128 chars
        ✓ should fail when try to save a type of more than 32 chars
        ✓ should fail when try to save a overview of more than 140 chars
      Method Find/Update/Delete
        ✓ should able to find all challenges
        ✓ should able to find a challenge with valid id
        ✓ should not able to find a challenge with invalid id
        ✓ should able to update a challenge with valid id
        ✓ should able to delete a challenge

To run karma tests only:

	$ export NODE_ENV=test		// only needs once in the console
	$ grunt karma

Karma test results:

	Running "karma:unit" (karma) task
	INFO [karma]: Karma v0.12.22 server started at http://localhost:9876/
	INFO [launcher]: Starting browser PhantomJS
	INFO [PhantomJS 1.9.7 (Mac OS X)]: Connected on socket Ui3TDSALAn984FcDXpcQ with id 2277599
	PhantomJS 1.9.7 (Mac OS X): Executed 17 of 17 SUCCESS (0.123 secs / 0.145 secs)

## MEAN.IO Testing framework

The server-side model testing is implemented with the frameworks `Mocha` and `should`. It requires at least Mocha and should APIs to write the actual tests, but the Mocha and should APIs are easy and fun to learn. By using Mocha and should APIs, BDD-style testing can be implemented easily.

The frameworks used for the client-side controller testing are `Karma` and `Jasmine`. But the style and API are very similar to Mocha and should.

In MEAN.IO, `grunt` makes easy to run the tests. All configurations are done already, only need to write the actual tests with these frameworks.

### Model Test with Mocha

The Challenge model test is implemented in `packages/challenges/server/tests/challenges.js`.

Since Challenge model is defined in PostgreSQL, the test code needs to use `sequelize` object to get Challenge model. By using Mocha/should and Sequelize model API, the testing for all CURD operations can be easily implemented.

First get the Challenge model from sequelize object:

	var postgresql = require('postgresql-sequelize');
	var sequelize = postgresql.sequelize;
	sequelize.options.logging = false;
	var Challenge = sequelize.model('challenge');

By default sequelize logs a raw SQL statement to console.log, `sequelize.options.logging = false` disables the default logging during the test.

The actual test codes are Mocha/should API with sequelize model API, please look the test codes for the detail implementation.


### Client-side Controller Test with Karma

The Challenges controller testing is implemented in `packages/challenges/public/tests/challenges.spec.js`.

For each test, mock controller is created and test injects the dependencies. Then each test set the mock response for backend request, invoke controller scope method. Then verify the result values in the scope.

Please look the test codes for the detail implementation.


Thank very much
