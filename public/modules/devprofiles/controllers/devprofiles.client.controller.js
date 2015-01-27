'use strict';

// Devprofiles controller
angular.module('devprofiles').controller('DevprofilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Devprofiles',
	function($scope, $stateParams, $location, Authentication, Devprofiles) {
		
		$scope.authentication = Authentication;
		$scope.skills = [];
		$scope.portfolio = {
			options: [
				{ project: '', skills: '' },
				{ project: '', skills: '' },
				{ project: '', skills: '' },
				{ project: '', skills: '' },
				{ project: '', skills: '' },
				{ project: '', skills: '' },
				{ project: '', skills: '' }
			]
		};
		$scope.experience = {
			options: [
				{ skill: '', period: '' },
				{ skill: '', period: '' },
				{ skill: '', period: '' },
				{ skill: '', period: '' },
				{ skill: '', period: '' },
				{ skill: '', period: '' },
				{ skill: '', period: '' }
			]
		};
		
		// Create new Devprofile
		$scope.create = function() {
			// Create new Devprofile object
			var devprofile = new Devprofiles ({
				name: this.name,
				location: this.location,
				languages: this.devLangs,
				skills: this.skills,
				profilePic: this.profileImg,
				portfolio: this.portfolio,
				amazing:this.amazing,
				experience: this.experience,
				inclients: this.inclients,
				note: this.note,
				available: this.available.label,
				environment:this.environment,
				mynote: this.mynote,
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
				$scope.showStreetviewImg = true;
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
					//location for streetview
					console.log(ubication.k);
					console.log(ubication.D);
					$scope.loc_k = ubication.k;
					$scope.loc_D = ubication.D;

					var marker = new google.maps.Marker({
					    position: place.geometry.location,
					    animation: google.maps.Animation.DROP,
					    map: map
					});
					map.setZoom(12);
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
			$scope.getKeyLang = function(keyCode){
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
		};

		$scope.onUCUploadComplete = function(image){
			$scope.profileImg = image.cdnUrl;
			$scope.$apply();
		};

		$scope.setPortfolio = function(){
			$scope.showPortfoliosLink = false;
			$scope.showPortfoliosInput = true;
			$scope.portfolioClass = "black-bg";

			$scope.savePortfolio =function(){
				if($scope.portfolio.options[0].project == ""){
					$scope.showPortfoliosLink = true; 
					$scope.showPortfolioList = false;
					$scope.portfolioClass = "white-bg";
				} else {	
					$scope.showPortfoliosInput = false;
					$scope.showPortfolioList = true;
					$scope.portfolioClass = "white-bg";
				}
			}

			$scope.editPortfolio =function(){
				$scope.showPortfoliosInput = true;
				$scope.showPortfolioList = false;
				$scope.portfolioClass = "black-bg";
			}
		};

		$scope.setExperience = function(){
			$scope.showExperiencesLink = false;
			$scope.showExperiencesInput = true;
			$scope.experienceClass = "black-bg";

			$scope.saveExperience =function(){
				if($scope.experience.options[0].skill == ""){
					console.log("nada")
					$scope.showExperiencesLink = true; 
					$scope.showExperienceList = false;
					$scope.experienceClass = "white-bg";
				} else {	
					$scope.showExperiencesInput = false;
					$scope.showExperienceList = true;
					$scope.experienceClass = "white-bg";
				}
			}

			$scope.editExperience =function(){
				$scope.showExperiencesInput = true;
				$scope.showExperienceList = false;
				$scope.experienceClass = "black-bg";
			}
		};

		$scope.setAmazing = function(){
			$scope.showAmazingTxt = false;
			$scope.showAmazingLink = false;
			$scope.showAmazingInput = true;
			$scope.amazingClass = "black-bg";
			
			$scope.saveAmazing =function(){
				if(!$scope.amazing){
					$scope.showAmazingLink = true;
					$scope.amazingClass = "white-bg";
				}else{
					$scope.showAmazingTxt = true;
					$scope.showAmazingInput = false;
					$scope.amazingClass = "white-bg";
				}
			}

			$scope.editAmazing =function(){
				$scope.showAmazingInput = true;
				$scope.showAmazingTxt = false;
				$scope.amazingClass = "black-bg";
			}
		};

		$scope.setInclients = function(){
			$scope.showInclientsTxt = false;
			$scope.showInclientsLink = false;
			$scope.showInclientsInput = true;
			$scope.inclientsClass = "black-bg";
			
			$scope.saveInclients =function(){
				if(!$scope.inclients){
					$scope.showInclientsLink = true;
					$scope.inclientsClass = "white-bg";
				}else{
					$scope.showInclientsTxt = true;
					$scope.showInclientsInput = false;
					$scope.inclientsClass = "white-bg";
				}
			}

			$scope.editInclients =function(){
				$scope.showInclientsInput = true;
				$scope.showInclientsTxt = false;
				$scope.inclientsClass = "black-bg";
			}
		};

		$scope.setNote = function(){
			$scope.showNoteTxt = false;
			$scope.showNoteLink = false;
			$scope.showNoteInput = true;
			$scope.noteClass = "black-bg";
			
			$scope.saveNote =function(){
				if(!$scope.note){
					$scope.showNoteLink = true;
					$scope.noteClass = "white-bg";
				}else{
					$scope.showNoteTxt = true;
					$scope.showNoteInput = false;
					$scope.noteClass = "white-bg";
				}
			}

			$scope.editNote =function(){
				$scope.showNoteInput = true;
				$scope.showNoteTxt = false;
				$scope.noteClass = "black-bg";
			}
		};

		$scope.setMyNote = function(){
			$scope.showMyNoteTxt = false;
			$scope.showMyNoteLink = false;
			$scope.showMyNoteInput = true;
			$scope.mynoteClass = "black-bg";
			
			$scope.saveMyNote =function(){
				if(!$scope.mynote){
					$scope.showMyNoteLink = true;
					$scope.mynoteClass = "white-bg";
				}else{
					$scope.showMyNoteTxt = true;
					$scope.showMyNoteInput = false;
					$scope.mynoteClass = "white-bg";
				}
			}

			$scope.editMyNote =function(){
				$scope.showMyNoteInput = true;
				$scope.showMyNoteTxt = false;
				$scope.mynoteClass = "black-bg";
			}
		};

		$scope.setEnvironment = function(){
			$scope.showEnvironmentTxt = false;
			$scope.showEnvironmentLink = false;
			$scope.showEnvironmentInput = true;
			$scope.environmentClass = "black-bg";
			
			$scope.saveEnvironment =function(){
				if(!$scope.environment){
					$scope.showEnvironmentLink = true;
					$scope.environmentClass = "white-bg";
				}else{
					$scope.showEnvironmentTxt = true;
					$scope.showEnvironmentInput = false;
					$scope.environmentClass = "white-bg";
				}
			}

			$scope.editEnvironment =function(){
				$scope.showEnvironmentInput = true;
				$scope.showEnvironmentTxt = false;
				$scope.environmentClass = "black-bg";
			}
		};

		$scope.availability = function(){
			$scope.avOptions = [
				{ label: 'Hourly', value: 1 },
				{ label: 'Half-time', value: 2 },
				{ label: 'Full-time', value: 3 }
			];
			$scope.available = $scope.avOptions[1];
		};

	}
]);

