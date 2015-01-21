'use strict';

// Devprofiles controller
angular.module('devprofiles').controller('DevprofilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Devprofiles',
	function($scope, $stateParams, $location, Authentication, Devprofiles) {
		$scope.authentication = Authentication;

		// Create new Devprofile
		$scope.create = function() {
			// Create new Devprofile object
			var devprofile = new Devprofiles ({
				name: this.name
			});

			// Redirect after save
			devprofile.$save(function(response) {
				$location.path('devprofiles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Devprofile
		$scope.remove = function(devprofile) {
			if ( devprofile ) { 
				devprofile.$remove();

				for (var i in $scope.devprofiles) {
					if ($scope.devprofiles [i] === devprofile) {
						$scope.devprofiles.splice(i, 1);
					}
				}
			} else {
				$scope.devprofile.$remove(function() {
					$location.path('devprofiles');
				});
			}
		};

		// Update existing Devprofile
		$scope.update = function() {
			var devprofile = $scope.devprofile;

			devprofile.$update(function() {
				$location.path('devprofiles/' + devprofile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Devprofiles
		$scope.find = function() {
			$scope.devprofiles = Devprofiles.query();
		};

		// Find existing Devprofile
		$scope.findOne = function() {
			$scope.devprofile = Devprofiles.get({ 
				devprofileId: $stateParams.devprofileId
			});
		};

		$scope.clickedName = function(){
			$scope.showInputName = true;
			$scope.getKey = function(keyCode){
				if (keyCode == "13"){
					$scope.showInputName = false;
				}
			};
		}

	}
]);

