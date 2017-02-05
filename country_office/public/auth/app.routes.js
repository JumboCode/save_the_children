angular.module('stc_admin').config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/login');
  
  $stateProvider
  	// The authentication routes
    .state("authentication", {
  		url: "/login",
  		views: {
			"content@": {
	  		controller: "AuthenticationController",
  			templateUrl: "/auth/components/Authentication/authentication.html"
        }
      }
    })
 	// The authentication routes
    .state("authentication.register", {
  		url: "/register",
  		views: {
			"content@": {
	  		controller: "AuthenticationController",
  			templateUrl: "/auth/components/Authentication/register.html"
        }
      }
    });
	
});

// don't use '#'s in URLs
angular.module('stc_admin').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);