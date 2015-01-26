'use strict';

//Setting up route
angular.module('devprofiles').config(['$stateProvider',
	function($stateProvider) {
		// Devprofiles state routing
		$stateProvider.
		state('listDevprofiles', {
			url: '/devprofiles',
			templateUrl: 'modules/devprofiles/views/list-devprofiles.client.view.html'
		}).
		state('tstview', {
			url: '/devprofiles/tstview',
			templateUrl: 'modules/devprofiles/views/tst.view.html'
		}).
		state('createDevprofile', {
			url: '/devprofiles/create',
			templateUrl: 'modules/devprofiles/views/create-devprofile.client.view.html'
		}).
		state('viewDevprofile', {
			url: '/devprofiles/:devprofileId',
			templateUrl: 'modules/devprofiles/views/view-devprofile.client.view.html'
		}).
		state('editDevprofile', {
			url: '/devprofiles/:devprofileId/edit',
			templateUrl: 'modules/devprofiles/views/edit-devprofile.client.view.html'
		}).
		state('uploadImg', {
			url: '/devprofiles/uploads',
			templateUrl: ''
		});
	}
]);