# [PEAN.io prototype - MEAN with PostgreSQL support](http://www.topcoder.com/challenge-details/30045010/)

For this challenge, I evaluated two ORM modules [Sequelize](http://sequelizejs.com) and [jugglingdb](https://github.com/1602/jugglingdb). The jugglingdb API is similar to moongoose API, and it supports ***Redis** and ***MongoDB***, but there seems no way to add `json` or `jsonb` type. For the relational database support, the Sequelize is far superior than jugglingdb. The Sequelize maps correctly `json`, `jsonb` or `array` data type and also creates correctly the constraints like `NOT NULL` or `UNIQUE`. So the solution is implemented with the Sequelize module.


## App Demo Screencast

[App Demo Screencast](https://www.youtube.com/watch?v=mI4Oj4m1ceE)

[Code Overview Screencast](https://www.youtube.com/watch?v=kfFy2ltywGI)


## Heroku Demo App

[Heroku demo app](http://mean-postgresql.herokuapp.com/) is deployed in the heroku.

The heroku app has one regular use ***topcoder3@gmail.com*** for your test, the password is `password1`.

Since local deploy is simple, I recommend not to use the heroku deploy for reviewing. If multiple reviewers access at the same time, there can be undesirable results.


## REST API Documentation

The [REST API Documentation](http://docs.meanpostgres.apiary.io/) is created in the apiary.io.


## Prerequisites
Please go over [MEAN.IO documentation](http://mean.io/#!/docs) to have a basic understanding about the MEAN.IO.

The MEAN.IO is built with `Node.js` and various npm modules. I recommend to install the latest `Node.js`.

The MEAN.IO application requires the `MongoDB`, please install MongoDB locally. It's possible to use a remote MongoDB from [mongolab.com](https://mongolab.com) or any other provider, but recommend to install local one.

This application requires `PostgreSQL 9.4` which supports ***jsonb*** data type, currently `Beta 2` is available. I installed the `PostgreSQL 9.4 Beta 2` with HomeBrew in Mac OS Mavericks.

	$ brew update
	$ brew uninstall postgresql		// if already installed
	$ brew install --devel postgresql

If you uses PgAdmin3, please upgrade the PgAdmin3 to `1.20.0 Beta 1` version to work with PostgreSQL 9.4.

## Configuration

The configuration for local deploy is in the `config/env/development.js`. Please configure MongoDB URL and PostgreSQL URL.

The default MongoDB URL:

	db: 'mongodb://localhost/mean-dev',
	
Please create `mean_test` database through PgAdmin tool.

The PostgreSQL database URL:

	pg: {
	    database: 'mean_test',
	    username: 'your-user',
	    password: 'xxx',
	    host: 'localhost',
	    port: 5432
	}


## Local Deploy

Please make sure PostgreSQL is running. It can be started by by `pg_ctl` or Mac OS `launchctl` or any other platform specific way.

Start MongoDB:

	$ mongod
	
This is a command from the MongoDB installed in Mac by [HomeBrew](http://brew.sh). In windows, follow [Install MongoDB on Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/).

Unzip the project zip file:

    $ unzip mean-postgresql.zip
    $ cd mean-postgresql
	
Install modules:

    $ npm install

Run the app. The app starts with `development` environment by default.

    $ npm start

Then, open a browser and go to:

    http://localhost:3000

Click `Register` link in the top right corner, register one regular user and sign with the registered user.

After sign in, click `Challenges` or `Create New Challenge` link on the top navigation menu.



## REST API Test
	
The API can be tested easily with Chrome plugin [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en). The `portman.json` for testing the app REST API is included in the submission. Please import `postman.json` to the Chrome plugin Postman.

When testing API, please change values or ids based for your objects.

When API has an error, it returns the following JSON object.

	{
		error: "error message ...."
	}


## Heroku Deploy

Before you start make sure you have the [Heroku toolbelt](<https://toolbelt.heroku.com/")
installed. Create a MongoDB instance from [mongolab](https://mongolab.com) or use one of heroku MongoDB addons, then configure MongoDB database URL/user/password to the `config/env/production.js`.

Note that the PostgreSQL is configured from DATABASE_URL, no need to configure it.

	$ rm -rf .git
	$ git init
	$ git add .
	$ git commit -m "initial commit"
	$ heroku apps:create
	$ heroku config:set NODE_ENV=production
	$ heroku addons:add heroku-postgresql:dev
	$ heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
	$ git push heroku master


The Heroku postgres is still in 9.3 version, which means `jsonb` type is not supported. To deploy the application to Heroku, please change `jsonb` to `json` in Challenge model ***technicalRequirements*** field, comment out the set method.

	technicalRequirements: {
		type: Sequelize.JSON, 	// JSONB is not supported in Heroku postgres.
		set: function(value) {
			return this.setDataValue('technicalRequirements', JSON.stringify(value));
		}
	},

## Challenges Table Schema

This is a Challenges table schema from PgAdmin3 created by Sequelize module.

```
	CREATE TABLE "Challenges"
	(
	  id serial NOT NULL,
	  "startDate" timestamp with time zone,
	  "endDate" timestamp with time zone,
	  title text NOT NULL,
	  overview text,
	  description character varying(140),
	  "functionalRequirements" json,
	  "technicalRequirements" jsonb,
	  tags text[],
	  "createdAt" timestamp with time zone NOT NULL,
	  "updatedAt" timestamp with time zone NOT NULL,
	  CONSTRAINT "Challenges_pkey" PRIMARY KEY (id),
	  CONSTRAINT "Challenges_title_key" UNIQUE (title)
	)
```

For the relational database, the Sequelize module works best, it maps everything correctly.

* The `json` data type in the ***functionalRequirements*** column is created correctly.
* The `jsonb` data type in the ***technicalRequirements*** column is created correctly.
* The `array` data type in the ***tags*** column is created correctly.
* The `length 140` is mapped correctly in the ***description*** column.
* The `NOT NULL` and `UNIQUE` constraints in the ***title*** column are also correctly populated.



## Implementation Details

The solution is implemented with Sequelize module, first installed sequelize module and pg module.

	npm install --save sequelize
	npm install --save pg

Each ORM has a API to open a connection to database, typically this is done through schema object. For example in the Sequealize module:

	var Sequelize = require('sequelize');
	var sequelize = new Sequelize(database, user, pass, {options});

The `sequelize` object has a connection to database and model definitions, this sequelize object must be shared for this challenge. If this object is not shared, then each package creates its own connection and models. So the connection resources are wasted and also one model created in a package can't be accessed from another packages.

There are a few ways to share this sequelize object:

	1. use global
	2. create the schema object inside mean.io core, which requires to modify the mean.io core.
	3. use npm module

The modifying mean.io core will break the future upgrade, using global is not a good practise. So I decide to use npm module.

For this challenge, I created `postgresql-sequelize` module to share sequelize object across the mean.io application. The sequelize object is created inside the `postgresql-sequelize` module.

Install `postgresql-sequelize` module.

	npm install --save postgresql-sequelize

When the application code defines models or accesss database, needs to requrie `postgresql-sequelize` to get the shared `sequelize` object.

	var postgresql = require('postgresql-sequelize');
	var sequelize = postgresql.sequelize;

The `sequelize` object returned from postgresql is shared across the mean.io application.


Thank very much
