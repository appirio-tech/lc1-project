#  simple tags and accounts [challenge](http://www.topcoder.com/challenge-details/30045946)

## Deployment

### Create DB (if test with local DB)
To test with local DB, you need postgresql DB and mongoDB running in local.

Create a database in postgresql, and  copy config/env/development.js to local.js and modify to connect to you local database. MongoDB database will be created automatically.

### Install dependency
```
npm install
```
This will install necessary dependencies.

### Run:
```
grunt local
```
This will migrate db and start server.

## Change list

*   modified:   bower.json
*   modified:   config/assets.json
*   modified:   packages/challenges/app.js
*   modified:   packages/challenges/public/controllers/challenges.js
*   modified:   packages/challenges/public/views/edit.html
*   modified:   packages/challenges/public/views/view.html
*   modified:   packages/challenges/server/models/challenge.js
*   modified:   packages/challenges/server/routes/challenge.js
*   modified:   packages/system/public/assets/css/common.css
*
Untracked files:
*
*   docs/schema/migrations/20140922143447-addAccounts.js
*   docs/schema/migrations/20140922145153-addTags.js
*   packages/challenges/public/services/tags.js
*   packages/challenges/server/controllers/accounts.js
*   packages/challenges/server/controllers/tags.js
*   packages/challenges/server/models/account.js
*   packages/challenges/server/models/tag.js


## Change description
There are several places changed:

### DB migrate script
Added js script to migrate DB, for account and tag, added column in challenge table for accountId.

### Model
Added model for account and tag.

### Express controller
Added controller for account and tag to create/find data.

### Express routes
Route for account and tag create/get

### bower.json
I used ui-select for multiple typeahead selection for tags. So need to add dependency.
For account typeahead, I just used typeahead function of ui-bootstrap.

### assets.json and app.js
Added ui-select in module and related js/css.

### Angular.js controller for challenge
Implement account and tag typeahead related code.

### challenge edit/view html
Display and edit page.


## clip on Youtube
https://www.youtube.com/watch?v=3aNchIyypCw
