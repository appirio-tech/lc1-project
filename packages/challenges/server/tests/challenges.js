'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var postgresql = require('postgresql-sequelize');
var sequelize = postgresql.sequelize;
// turn of sequelize logging. It looks hackish, but it works.
sequelize.options.logging = false;
var Challenge = sequelize.model('challenge');

var SAMPLE_TEXT_10 = '1234567890';

/**
 * Globals
 */
var data;
var challenge;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Challenge:', function() {
    beforeEach(function(done) {
      data = {
        title: 'Challenge Title',
        type: 'type-code',
        overview: '<p>Challenge Overview</p>',
        description: 'long description',
        regStartDate: '2014-08-13',
        subEndDate: '2014-08-18',
        registeredDescription: 'Registered Description',
        tags: ['tag1', 'tag2']
      };
      done();
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        Challenge.create(data).success(function(savedChallenge) {
          challenge = savedChallenge;
          challenge.id.should.not.have.length(0);
          challenge.createdAt.should.not.have.length(0);
          challenge.updatedAt.should.not.have.length(0);
          challenge.title.should.equal('Challenge Title');
          challenge.overview.should.equal('<p>Challenge Overview</p>');
          challenge.type.should.equal('type-code');
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save a title of more than 128 chars', function(done) {
        for (var i=0; i<13; i+=1) {
          data.title += SAMPLE_TEXT_10;
        }

        Challenge.create(data).success(function(savedChallenge) {
          should.not.exist(savedChallenge);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save a type of more than 32 chars', function(done) {
        for (var i=0; i<4; i+=1) {
          data.type += SAMPLE_TEXT_10;
        }

        Challenge.create(data).success(function(savedChallenge) {
          should.not.exist(savedChallenge);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save a overview of more than 140 chars', function(done) {
        for (var i=0; i<15; i+=1) {
          data.overview += SAMPLE_TEXT_10;
        }

        Challenge.create(data).success(function(savedChallenge) {
          should.not.exist(savedChallenge);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });
    });

    describe('Method Find/Update/Delete', function() {
      beforeEach(function(done) {
        // create a challenge
        Challenge.create(data).success(function(savedChallenge) {
          challenge = savedChallenge;
          done();
        });
      });

      it('should able to find all challenges', function(done) {
        Challenge.findAll().success(function(allChallenges) {
          allChallenges.length.should.equal(1);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to find a challenge with valid id', function(done) {
        Challenge.find(challenge.id).success(function(retrievedChallenge) {
          challenge.id.should.equal(retrievedChallenge.id);
          challenge.title.should.equal(retrievedChallenge.title);
          challenge.overview.should.equal(retrievedChallenge.overview);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });


      it('should not able to find a challenge with invalid id', function(done) {
        Challenge.find(999999).success(function(retrievedChallenge) {
          should.not.exist(retrievedChallenge);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a challenge with valid id', function(done) {
        challenge.title = 'Challenge Modified';
        challenge.save().success(function(updatedChallenge) {
          updatedChallenge.id.should.equal(challenge.id);
          updatedChallenge.title.should.equal('Challenge Modified');
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to delete a challenge', function(done) {
        challenge.destroy().success(function() {
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      if (challenge) {
        challenge.destroy().success(function() {
          challenge = undefined;
          done();
        })
        .error(function(err){
          done();
        });
      } else {
        done();
      }

    });
  });
});
