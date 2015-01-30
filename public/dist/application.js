'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'toptaltst';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ngMap', 'ngRoute', 'ng-uploadcare'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('devprofiles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('devprofiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Devprofiles', 'devprofiles', 'dropdown', '/devprofiles(/create)?');
		Menus.addSubMenuItem('topbar', 'devprofiles', 'List Devprofiles', 'devprofiles');
		Menus.addSubMenuItem('topbar', 'devprofiles', 'New Devprofile', 'devprofiles/create');
	}
]);
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
		});
	}
]);
'use strict';

// Devprofiles controller
angular.module('devprofiles').controller('DevprofilesController', ['$scope', 'ngRoute', '$stateParams', '$location', 'Authentication', 'Devprofiles',
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
		$scope.onMeOneData = {image:'', tagline:''}
		$scope.onMeTwoData = {image:'', tagline:''}
		
		// Create new Devprofile
		$scope.create = function() {
			// Create new Devprofile object
			var devprofile = new Devprofiles ({
				name: this.name,
				location: this.location,
				devUbication: this.devUbication,
				ubiLatLng: this.ubiLatLng,
				mapLink:this.mapLink,
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
				onMeOneData:this.onMeOneData,
				onMeTwoData:this.onMeTwoData,
				sCode: this.sCode
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
					var ubiLatLng =  [];
					var marker = new google.maps.Marker({
					    position: place.geometry.location,
					    animation: google.maps.Animation.DROP,
					    map: map
					});
					map.setZoom(12);
					google.maps.event.trigger(map,'resize');
					map.panTo(ubication);
					ubiLatLng.push(ubication.k, ubication.D);
					$scope.ubiLatLng = ubiLatLng;
					console.log(ubiLatLng);
					$scope.devUbication = ubication;
					$scope.loc_k = ubication.k;
					$scope.loc_D = ubication.D;
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
			console.log("main image: "+image);
			$scope.profileImg = image.cdnUrl;
			$scope.$apply();
		};

		$scope.onMeOne = function(image){
			console.log("one: "+image.cdnUrl);
			$scope.showOnMeOneLink=false;
			$scope.showOnMeOneImg=true; 
			$scope.showOnMeOneInput=true; 
			$scope.myselfImg1 = image.cdnUrl;
			$scope.$apply();
			$scope.saveOnMeOne = function(){
				$scope.showOnMeOneInput = false;
				$scope.showOnMeOneLegend = true; 
				$scope.onMeOneData.image = $scope.myselfImg1;
				$scope.onMeOneData.tagline = $scope.onMeOneLegend;
				console.log($scope.onMeOneData)		;		
			};
			$scope.getKeyOnMe1 = function(keyCode){
				if (keyCode == '13'){
					$scope.saveOnMeOne();
				}
			};
			$scope.editOnMeOne = function(){
				$scope.showOnMeOneInput=true;
				$scope.showOnMeOneLegend=false; 
			};	
		};

		$scope.onMeTwo = function(image){
			console.log("two: "+image.cdnUrl);
			$scope.showOnMeTwoLink=false;
			$scope.showOnMeTwoImg=true; 
			$scope.showOnMeTwoInput=true; 
			$scope.myselfImg2 = image.cdnUrl;
			$scope.$apply();
			$scope.saveOnMeTwo = function(){
				$scope.showOnMeTwoInput = false;
				$scope.showOnMeTwoLegend = true; 
				$scope.onMeTwoData.image = $scope.myselfImg2;
				$scope.onMeTwoData.tagline = $scope.onMeTwoLegend;
				// console.log($scope.onMeTwoData)		;		
			};
			$scope.getKeyOnMe2 = function(keyCode){
				if (keyCode == '13'){
					$scope.saveOnMeTwo();
				}
			};
			$scope.editOnMeTwo = function(){
				$scope.showOnMeTwoInput=true;
				$scope.showOnMeTwoLegend=false; 
			};	
		};

		$scope.sCode = function(image){
			console.log("sCode: " + image.cdnUrl);
			$scope.showSCodeLink=false;
			$scope.sCode = image.cdnUrl;
			$scope.showSCodeImg=true; 
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);