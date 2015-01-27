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
	amazing: {
		type: String,
		default: ''
	},
	note: {
		type: String,
		default: ''
	},
	mynote: {
		type: String,
		default: ''
	},
	available: {
		type: String,
		default: ''
	},
	sCode: {
		type: String,
		default: ''
	},
	environment: {
		type: String,
		default: ''
	},
	skills: {
		type: Array,
		default: ''
	},
	inclients: {
		type: String,
		default: ''
	},
	portfolio: {
		type: Object,
		default: ''
	},
	experience: {
		type: Object,
		default: ''
	},
	onMeOneData: {
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