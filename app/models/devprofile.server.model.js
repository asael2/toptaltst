'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Devprofile Schema
 */
var DevprofileSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Devprofile name',
		trim: true
	},
	languages: {
		type: String,
		default: ''
	},
	location: {
		type: String,
		default: ''
	},
	profilePic: {
		type: String,
		default: ''
	},
	skills: {
		type: Array,
		default: ''
	},
	portfolio: {
		type: Object,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Devprofile', DevprofileSchema);