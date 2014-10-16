
# tc-discussion directive


***tc-discussion directive displays the discussion messages in a challenge.***

* Challenge: [Discussion Directive](http://community.topcoder.com/tc?module=ProjectDetail&pj=30046297)
* submitter: peakpado
* [source](--not sure how to get source url--)
* [video link](https://www.youtube.com/watch?v=GOBYJiH-63E)


### Configuration

The <tc-discussion> directive requires the URL of discussions service. Currently this URL is configured in the `discussionUrl` in the config/*.js, and it's exposed in GET '/discussionUrl' request.


### Deployment

To deploy <tc-discussion> to other projects, please follow these instructions.

* Include tc-discussion.js and discussion-template.html
* Expose the discussionUrl at the GET '/discussionUrl' request.

### Directive Attributes

The <tc-discussion> accepts two attributes.

* remote-object-name: the name of remote object, ex) Challenge.
* remote-object-id: the id of remote object, ex: the id of challenge record.


### CORS issue

This <tc-discussion> has CORS issue since serenity-core and discussion service are different host. Until CORS is enabled in these services, you need to disable to test this directive.

To disable CORS in Firefox:

	http://www-jo.se/f.pfleger/forcecors

To disable CORS in Chrome:

	http://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome
	

### Usage

Place <tc-discussion> with remote-object-name and remote-object-id attributes to the HTML.

	<tc-discussion remote-object-name="Challenge" remote-object-id="12345"></tc-discussion>


### Files changed
```
	modified:   config/env/development.js
	modified:   packages/challenges/public/directives/tc-discussion.js
	modified:   packages/challenges/public/views/view.html
	modified:   packages/challenges/server/controllers/challenges.js
	modified:   packages/challenges/server/routes/challenge.js
	added:   docs/tc-discussion-directive.md
	added:   packages/challenges/public/directives/tc-discussion.js
	added:   packages/challenges/public/views/directives/discussion-template.html
```

