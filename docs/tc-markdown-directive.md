
# tc-markdown directive


***tc-markdown directive displays the scope variable as markdown.***

* Challenge: [Just Markdown](http://www.topcoder.com/challenge-details/30046006/)
* submitter: peakpado
* [source](https://software.topcoder.com/review/actions/DownloadContestSubmission.do?method=downloadContestSubmission&uid=299829)
* [video link](https://www.youtube.com/watch?v=toRIwruHr6A) 


### Usage

In the controller

     $scope.content = '--- markdown content ---'

In the HTML:

	<div tc-markdown="content"></div>

### Files changed
```
	modified:   bower.json
	modified:   config/assets.json
	modified:   packages/articles/app.js
	modified:   packages/articles/public/controllers/articles.js
	modified:   packages/articles/public/views/create.html
	modified:   packages/articles/public/views/edit.html
	modified:   packages/articles/public/views/view.html
	modified:   packages/challenges/app.js
	modified:   packages/challenges/public/assets/css/challenges.css
	modified:   packages/challenges/public/controllers/challenges.js
	modified:   packages/challenges/public/views/edit.html
	modified:   packages/challenges/public/views/list.html
	added:     docs/tc-markdown-directive.md
	added:     packages/challenges/public/directives/tc-markdown.js
```
