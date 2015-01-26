'use strict';

// Devprofiles controller
angular.module('devprofiles').controller('DevprofilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Devprofiles',
	function($scope, $stateParams, $location, Authentication, Devprofiles) {
		
		$scope.authentication = Authentication;
		$scope.skills = [];
		$scope.profileBg= "";

		// Create new Devprofile
		$scope.create = function() {
			// Create new Devprofile object
			var devprofile = new Devprofiles ({
				name: this.name,
				location: this.location,
				languages: this.devLangs,
				skills: this.skills,
				profilePic: this.profileImg
			});

			// Redirect after save
			devprofile.$save(function(response) {
				// $location.path('devprofiles/' + response._id);
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

			$scope.showMapLocation = false;
			
			$scope.blurLocation = function(){
				$scope.showInputLocation = false;
			}
			
			$scope.clickedLocation = function(){
				$scope.showInputLocation = true;
				$scope.showMapLocation = true;
				$scope.devLocation = "";

				// Google Autocomplete
				var input = (document.getElementById('pac-input'));	
				var options = {
				  types: ['(cities)']
				};
				var autocomplete = new google.maps.places.Autocomplete(input, options);
				
				// Google Map
				var initialOpts = {
					center:new google.maps.LatLng(0,0),
					zoom:0,
					mapTypeControl: false,
					navigationControl: false,
					disableDefaultUI: true,
	                // disableDoubleClickZoom:true,
	                draggable: true,
	                streetViewControl:false,
	                mapTypeId:google.maps.MapTypeId.TERRAIN
				};
				var map = new google.maps.Map(document.getElementById("map-canvas"), initialOpts);

				google.maps.event.addListener(autocomplete, 'place_changed', function() {	
					var place = autocomplete.getPlace();
					var ubication = place.geometry.location;
					// map.setCenter(ubication);
					var marker = new google.maps.Marker({
					    position: place.geometry.location,
					    animation: google.maps.Animation.DROP,
					    map: map
					});
					map.setZoom(11);
					google.maps.event.trigger(map,'resize');
					map.panTo(ubication);
					
					$scope.devLocation = place.formatted_address;
					$scope.location = $scope.devLocation;
					$scope.showInputLocation = false;
					$scope.mapLink = place.url; 
					
				});
			}
		};

		$scope.setLanguages = function(){
			$scope.showInputLang = true;
			$scope.getKeyName = function(keyCode){
				if (keyCode == '13'){
					$scope.showInputLang = false;
				}
			};
		};

		$scope.skillGetKeyEsc = function(keyCode){
			if (keyCode == '27'){
				$scope.showInputSkill = false;
			}
		};

		$scope.addSkill = function(devSkill, skillevel) {
			var newSkill = {skill: devSkill, level: skillevel}
			$scope.skills.push(newSkill);
			$scope.devSkill = "";			
			$scope.showInputSkill = false;
		};

		$scope.removeSkill = function(index){
		    $scope.skills.splice(index, 1);
		    console.log($scope.skills);
		}

		$scope.onUCUploadComplete = function(image){
			$scope.profileImg = image.cdnUrl;
			$scope.$apply();
		};

	}
]);

