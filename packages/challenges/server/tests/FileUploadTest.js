'use strict';

var supertest = require('supertest');
var request = supertest('localhost:3000');

/**
 * Simple file upload test
 * Create a challenge before running this text
 */
describe('#FileUploadTest', function() {
  it('A File', function(done) {
    // first get all challenges and then add file to any challenge
    request.get('/challenges').end(function(err, res) {
      res.should.have.status(401);
      // the user is not authorized to access this resource
      var challengeId = 1;
      request.post('/challenges/' + challengeId + '/upload')
        .field('title', 'myfirstfile')
        .attach('uploadedFile', './dummyfile.txt')
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
});