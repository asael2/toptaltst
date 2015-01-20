'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var devprofiles = require('../../app/controllers/devprofiles.server.controller');

	// Devprofiles Routes
	app.route('/devprofiles')
		.get(devprofiles.list)
		.post(users.requiresLogin, devprofiles.create);

	app.route('/devprofiles/:devprofileId')
		.get(devprofiles.read)
		.put(users.requiresLogin, devprofiles.hasAuthorization, devprofiles.update)
		.delete(users.requiresLogin, devprofiles.hasAuthorization, devprofiles.delete);

	// Finish by binding the Devprofile middleware
	app.param('devprofileId', devprofiles.devprofileByID);
};
