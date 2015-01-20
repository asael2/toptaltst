'use strict';

(function() {
	// Devprofiles Controller Spec
	describe('Devprofiles Controller Tests', function() {
		// Initialize global variables
		var DevprofilesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Devprofiles controller.
			DevprofilesController = $controller('DevprofilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Devprofile object fetched from XHR', inject(function(Devprofiles) {
			// Create sample Devprofile using the Devprofiles service
			var sampleDevprofile = new Devprofiles({
				name: 'New Devprofile'
			});

			// Create a sample Devprofiles array that includes the new Devprofile
			var sampleDevprofiles = [sampleDevprofile];

			// Set GET response
			$httpBackend.expectGET('devprofiles').respond(sampleDevprofiles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.devprofiles).toEqualData(sampleDevprofiles);
		}));

		it('$scope.findOne() should create an array with one Devprofile object fetched from XHR using a devprofileId URL parameter', inject(function(Devprofiles) {
			// Define a sample Devprofile object
			var sampleDevprofile = new Devprofiles({
				name: 'New Devprofile'
			});

			// Set the URL parameter
			$stateParams.devprofileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/devprofiles\/([0-9a-fA-F]{24})$/).respond(sampleDevprofile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.devprofile).toEqualData(sampleDevprofile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Devprofiles) {
			// Create a sample Devprofile object
			var sampleDevprofilePostData = new Devprofiles({
				name: 'New Devprofile'
			});

			// Create a sample Devprofile response
			var sampleDevprofileResponse = new Devprofiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Devprofile'
			});

			// Fixture mock form input values
			scope.name = 'New Devprofile';

			// Set POST response
			$httpBackend.expectPOST('devprofiles', sampleDevprofilePostData).respond(sampleDevprofileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Devprofile was created
			expect($location.path()).toBe('/devprofiles/' + sampleDevprofileResponse._id);
		}));

		it('$scope.update() should update a valid Devprofile', inject(function(Devprofiles) {
			// Define a sample Devprofile put data
			var sampleDevprofilePutData = new Devprofiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Devprofile'
			});

			// Mock Devprofile in scope
			scope.devprofile = sampleDevprofilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/devprofiles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/devprofiles/' + sampleDevprofilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid devprofileId and remove the Devprofile from the scope', inject(function(Devprofiles) {
			// Create new Devprofile object
			var sampleDevprofile = new Devprofiles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Devprofiles array and include the Devprofile
			scope.devprofiles = [sampleDevprofile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/devprofiles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDevprofile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.devprofiles.length).toBe(0);
		}));
	});
}());