# [[serenity] Basic Requirements Model and View](http://www.topcoder.com/challenge-details/30045431/?type=develop)



Added Requirement model and ChallengeRequirement model, and implemented APIs and UI changes to add requirements to the challenge.

## App Demo Screencast

[App Demo Screencast](https://www.youtube.com/watch?v=mCy_Vf0cATM)


## Configuration

First please read the `README.md` in the project, create `config/env/local.js` from `config/env/development.js`

Create `serenity` database in the local PostgreSQL by using PgAdmin tool, set the PostgreSQL database parameters to the `config/env/local.js`.

The sample PostgreSQL database configuration:

	  "pg": {
	    "dialect": "postgres",
	    "database": "serenity",
	    "username": "postgres",
	    "password": "",
	    "host": "localhost",
	    "port": 5432
	  }

Run the ***docs/create.requirements.sql*** in the `serenity` database by PgAdmin tool. This will create tables required for this submission.


## Local Deploy

Please make sure PostgreSQL server is running.

Start MongoDB:

	$ mongod

Unzip the project zip file:

    $ unzip serenity-core-requirements.zip
    $ cd serenity-core-requirements

Install modules:

    $ npm install

Run the app with grunt in the `local` environment:

	$ grunt local

Then, open a browser and go to:

    http://localhost:3000



## REST Response

I changed the response format and how to set the error response in the code, this makes it easy to change the response data format and set the error object without duplicating code. The client-side code should use HTTP status code to determine whether the API is successful or failed.

When an API fails, ***error*** object is returned with `4xx or 5xx` status code.

##### Sample error response

	{
		error: {
			name: "ValidationError",
			message: "The file is required",
		}
	}

When API is successful, the actual data object is returned with HTTP status code `200`. This is also what the AngularJS $resource service expects, makes it easier to create AngularJS $resource.

##### Sample successful response

	{
		challengeId: 1,
		userId: 1,
		id: 3,
		createdAt: "2014-08-25T05:52:26.488Z",
		updatedAt: "2014-08-27T05:52:26.488Z"
	}


## API Test

The ***postman.json*** is included to the submission to test CRUD operations of `ChallengeRequirement` model.


## Heroku Deployment

Before you start make sure you have the [Heroku toolbelt](https://toolbelt.heroku.com)
installed. The `config/env/production.js` is already configured to use `MONGOLAB_URI` from MongoLab addon, just create MongoDB instance from `MongoLab`, no additional configuration is needed. Note that the PostgreSQL is configured from DATABASE_URL, no need to configure it.

	$ git init
	$ heroku apps:create
	$ heroku config:set NODE_ENV=production
	$ heroku addons:add heroku-postgresql:dev
	$ heroku addons:add mongolab
	$ heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git

	$ git add .
	$ git commit -m "initial commit"
	$ git push heroku master


## Implementation Details


##### Models and Controller Added

Two models are added for this challenge, they are ***Requirement*** and ***ChallengeRequirement***. The Requirement table has details of a requirement, the ChallengeRequirement is a join table that connects a Challenge and Requirement. I avoided using an association between models as the challenge requirement urged not to use high-level. The SQL to create these tables is provided in the ***docs/create.requirements.sql***.

The controller for challenge requirement is implemented in ***controllers/challenge-requirements.js***.

##### MongoDB id can't be used for userId

Currently the logged in user is saved in req.user, but this user object is MongoDB object, its _id can not be used for userId in the PostgreSQL tables. So for now all userId is hard-coded with 1.

##### Client-side Modification

* Added `ChallengeRequirements` resource.
* Added list of requirements in the challenge view.
* Added `Add Requirement` button in the challenge view.
	* On clicking `Add Requirement` button, new form to add a requirement shows up.
	* To save the requirement to current challenge, click `Save` button.
	* Clicking `Cancel` button removes the form.

When new requirement is added to the challenge, the Requirement is created with form data and ChallengeRequirement is created with the current userId and challengeId.


## Suggestions

* Consistent naming convention for table and field names.
	* Currently both camel-case and snake-case are used, suggest to set the naming convention for the project.
	* model name: singular with first letter upper case, ex) ***Challenge***.
	* table name: plural with lower case, ex) ***challenges***
	* field name: snake-case with lower case which can be distinguished from a regular variable,  ex) ***challenge_id***.
	* regular variable: camel-case, ex) ***challengeId***.




Thank you very much
