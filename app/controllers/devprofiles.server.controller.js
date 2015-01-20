'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Devprofile = mongoose.model('Devprofile'),
	_ = require('lodash');

/**
 * Create a Devprofile
 */
exports.create = function(req, res) {
	var devprofile = new Devprofile(req.body);
	devprofile.user = req.user;

	devprofile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devprofile);
		}
	});
};

/**
 * Show the current Devprofile
 */
exports.read = function(req, res) {
	res.jsonp(req.devprofile);
};

/**
 * Update a Devprofile
 */
exports.update = function(req, res) {
	var devprofile = req.devprofile ;

	devprofile = _.extend(devprofile , req.body);

	devprofile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devprofile);
		}
	});
};

/**
 * Delete an Devprofile
 */
exports.delete = function(req, res) {
	var devprofile = req.devprofile ;

	devprofile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devprofile);
		}
	});
};

/**
 * List of Devprofiles
 */
exports.list = function(req, res) { 
	Devprofile.find().sort('-created').populate('user', 'displayName').exec(function(err, devprofiles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devprofiles);
		}
	});
};

/**
 * Devprofile middleware
 */
exports.devprofileByID = function(req, res, next, id) { 
	Devprofile.findById(id).populate('user', 'displayName').exec(function(err, devprofile) {
		if (err) return next(err);
		if (! devprofile) return next(new Error('Failed to load Devprofile ' + id));
		req.devprofile = devprofile ;
		next();
	});
};

/**
 * Devprofile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.devprofile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
