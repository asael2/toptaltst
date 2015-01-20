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