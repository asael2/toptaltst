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
			
			$scope.clickedLocation = function(){
				$scope.showInputLocation = true;
				// console.log("clickedLocation");
			}

			$scope.getKeyLocation = function(keyCode){
				// console.log(document.getElementById("pac-input").value );
				$scope.location = document.getElementById("pac-input").value;
				if (keyCode == '13'){
					$scope.showInputLocation = false;
				}
			}
			
			$scope.blurLocation = function(){
				$scope.showInputLocation = false;
				// console.log( $scope.location);
			}
			
			// Google places

			var markers = [];

			// var map = new google.maps.Map(document.getElementById('map-canvas'), {
			// 	mapTypeId: google.maps.MapTypeId.ROADMAP
			// });

			var mapOpt = {
				center:new google.maps.LatLng(40,-75),
				zoom:12,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			var map=new google.maps.Map(document.getElementById("map-canvas"),mapOpt);
			

			// var defaultBounds = new google.maps.LatLngBounds(
			//   new google.maps.LatLng(-33.8902, 151.1759),
			//   new google.maps.LatLng(-33.8474, 151.2631) );

			// map.fitBounds(defaultBounds);

			// Create the search box and link it to the UI element.
			var input = (document.getElementById('pac-input'));
			// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			var searchBox = new google.maps.places.SearchBox(input);

			// Listen for the event fired when the user selects an item from the
			// pick list. Retrieve the matching places for that item.
			google.maps.event.addListener(searchBox, 'places_changed', function() {
				
				var places = searchBox.getPlaces();

				if (places.length == 0) {
				  return;
				}
				for (var i = 0, marker; marker = markers[i]; i++) {
				  marker.setMap(null);
				}

				// For each place, get the icon, place name, and location.
				markers = [];
				var bounds = new google.maps.LatLngBounds();

				for (var i = 0, place; place = places[i]; i++) {
					var image = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
					};

					// Create a marker for each place.
					var marker = new google.maps.Marker({
					map: map,
					icon: image,
					title: place.name,
					position: place.geometry.location
					});

					markers.push(marker);

					bounds.extend(place.geometry.location);

				}

				map.fitBounds(bounds);

			});

			// Bias the SearchBox results towards places that are within the bounds of the
			// current map's viewport.
			google.maps.event.addListener(map, 'bounds_changed', function() {
				var bounds = map.getBounds();
				searchBox.setBounds(bounds);
			});
		}

	}
]);

