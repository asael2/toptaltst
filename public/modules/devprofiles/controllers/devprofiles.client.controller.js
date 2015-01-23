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
			$scope.getKeyName = function(keyCode){
				if (keyCode == '13'){
					$scope.showInputName = false;
				}
			};
		};

		$scope.setLocation = function(){
			
			

			// $scope.getKeyLocation = function(keyCode){
			// 	// console.log(document.getElementById("pac-input").value );
				
			// 	//$scope.location = document.getElementById("pac-input").value;
			// 	if (keyCode == '13'){
			// 		$scope.showInputLocation = false;
			// 	}
			// }
			
			$scope.blurLocation = function(){
				$scope.showInputLocation = false;
				// console.log( $scope.location);
			}
			
			$scope.clickedLocation = function(){
				$scope.showInputLocation = true;
				// console.log("clickedLocation");
				// $scope.devLocation = place.formatted_address;
			
			// Google Maps
			var initialOpts = {
				center:new google.maps.LatLng(0,0),
				zoom:0,
				mapTypeControl: false,
				navigationControl: false,
				disableDefaultUI: true,
                // disableDoubleClickZoom:true,
                draggable: false,
                streetViewControl:false,
                mapTypeId:google.maps.MapTypeId.TERRAIN
			};
			var map = new google.maps.Map(document.getElementById("map-canvas"), initialOpts);
			// Google Autocomplete
			var input = (document.getElementById('pac-input'));	
			var options = {
			  types: ['(cities)']
			};
			var autocomplete = new google.maps.places.Autocomplete(input, options);
			google.maps.event.addListener(autocomplete, 'place_changed', function() {	
				var place = autocomplete.getPlace();
				map.setCenter(place.geometry.location);
				map.setZoom(11);
				$scope.devLocation = place.formatted_address;
				$scope.showInputLocation = false;
				console.log(place.formatted_address);
				// debugger;
			});
			}	
		}

	}
]);

