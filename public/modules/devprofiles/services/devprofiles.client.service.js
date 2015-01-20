'use strict';

//Devprofiles service used to communicate Devprofiles REST endpoints
angular.module('devprofiles').factory('Devprofiles', ['$resource',
	function($resource) {
		return $resource('devprofiles/:devprofileId', { devprofileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);