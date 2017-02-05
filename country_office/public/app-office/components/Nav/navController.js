angular.module('stc_admin.nav').controller('NavController', ['$scope', '$state', 'AuthenticationService',
  function ($scope, $state, AuthenticationService) {
	  // This is where all the functions are called
	
	  $scope.logout = function(){		  
		  AuthenticationService.logout();
	  }
  }
]);