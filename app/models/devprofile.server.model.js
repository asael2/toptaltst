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
	profilepic: {
		type: String,
		default: '',
		trim: true
	},
	location: {
		type: String,
		default: ''
	},
	languages: {
		type: Array,
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