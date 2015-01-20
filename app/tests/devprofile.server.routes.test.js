'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Devprofile = mongoose.model('Devprofile'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, devprofile;

/**
 * Devprofile routes tests
 */
describe('Devprofile CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Devprofile
		user.save(function() {
			devprofile = {
				name: 'Devprofile Name'
			};

			done();
		});
	});

	it('should be able to save Devprofile instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devprofile
				agent.post('/devprofiles')
					.send(devprofile)
					.expect(200)
					.end(function(devprofileSaveErr, devprofileSaveRes) {
						// Handle Devprofile save error
						if (devprofileSaveErr) done(devprofileSaveErr);

						// Get a list of Devprofiles
						agent.get('/devprofiles')
							.end(function(devprofilesGetErr, devprofilesGetRes) {
								// Handle Devprofile save error
								if (devprofilesGetErr) done(devprofilesGetErr);

								// Get Devprofiles list
								var devprofiles = devprofilesGetRes.body;

								// Set assertions
								(devprofiles[0].user._id).should.equal(userId);
								(devprofiles[0].name).should.match('Devprofile Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Devprofile instance if not logged in', function(done) {
		agent.post('/devprofiles')
			.send(devprofile)
			.expect(401)
			.end(function(devprofileSaveErr, devprofileSaveRes) {
				// Call the assertion callback
				done(devprofileSaveErr);
			});
	});

	it('should not be able to save Devprofile instance if no name is provided', function(done) {
		// Invalidate name field
		devprofile.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devprofile
				agent.post('/devprofiles')
					.send(devprofile)
					.expect(400)
					.end(function(devprofileSaveErr, devprofileSaveRes) {
						// Set message assertion
						(devprofileSaveRes.body.message).should.match('Please fill Devprofile name');
						
						// Handle Devprofile save error
						done(devprofileSaveErr);
					});
			});
	});

	it('should be able to update Devprofile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devprofile
				agent.post('/devprofiles')
					.send(devprofile)
					.expect(200)
					.end(function(devprofileSaveErr, devprofileSaveRes) {
						// Handle Devprofile save error
						if (devprofileSaveErr) done(devprofileSaveErr);

						// Update Devprofile name
						devprofile.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Devprofile
						agent.put('/devprofiles/' + devprofileSaveRes.body._id)
							.send(devprofile)
							.expect(200)
							.end(function(devprofileUpdateErr, devprofileUpdateRes) {
								// Handle Devprofile update error
								if (devprofileUpdateErr) done(devprofileUpdateErr);

								// Set assertions
								(devprofileUpdateRes.body._id).should.equal(devprofileSaveRes.body._id);
								(devprofileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Devprofiles if not signed in', function(done) {
		// Create new Devprofile model instance
		var devprofileObj = new Devprofile(devprofile);

		// Save the Devprofile
		devprofileObj.save(function() {
			// Request Devprofiles
			request(app).get('/devprofiles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Devprofile if not signed in', function(done) {
		// Create new Devprofile model instance
		var devprofileObj = new Devprofile(devprofile);

		// Save the Devprofile
		devprofileObj.save(function() {
			request(app).get('/devprofiles/' + devprofileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', devprofile.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Devprofile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devprofile
				agent.post('/devprofiles')
					.send(devprofile)
					.expect(200)
					.end(function(devprofileSaveErr, devprofileSaveRes) {
						// Handle Devprofile save error
						if (devprofileSaveErr) done(devprofileSaveErr);

						// Delete existing Devprofile
						agent.delete('/devprofiles/' + devprofileSaveRes.body._id)
							.send(devprofile)
							.expect(200)
							.end(function(devprofileDeleteErr, devprofileDeleteRes) {
								// Handle Devprofile error error
								if (devprofileDeleteErr) done(devprofileDeleteErr);

								// Set assertions
								(devprofileDeleteRes.body._id).should.equal(devprofileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Devprofile instance if not signed in', function(done) {
		// Set Devprofile user 
		devprofile.user = user;

		// Create new Devprofile model instance
		var devprofileObj = new Devprofile(devprofile);

		// Save the Devprofile
		devprofileObj.save(function() {
			// Try deleting Devprofile
			request(app).delete('/devprofiles/' + devprofileObj._id)
			.expect(401)
			.end(function(devprofileDeleteErr, devprofileDeleteRes) {
				// Set message assertion
				(devprofileDeleteRes.body.message).should.match('User is not logged in');

				// Handle Devprofile error error
				done(devprofileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Devprofile.remove().exec();
		done();
	});
});