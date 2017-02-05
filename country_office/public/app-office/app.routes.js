angular.module('stc_admin').config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');
  
  $stateProvider
//  	// The authentication routes
//    .state("authentication", {
//  		url: "/login",
//  		views: {
//			"content@": {
//	  		controller: "AuthenticationController",
//  			templateUrl: "/components/Authentication/authentication.html"
//        }
//      }
//    })
// 	// The authentication routes
//    .state("authentication.register", {
//  		url: "/register",
//  		views: {
//			"content@": {
//	  		controller: "AuthenticationController",
//  			templateUrl: "/components/Authentication/register.html"
//        }
//      }
//    })
    
  	// The main app routes.. only accessible once the user is logged in
    .state("root", {
  		url: "/",
  		views: {
		"content": {
            controller: "HomeController",
            templateUrl: "/app-office/components/Home/home.html"
        },
		"nav": {
			controller: "NavController",
			templateUrl: "/app-office/components/Nav/nav.html"
		}
      }
    })
  	.state("root.pdfUpload", {
      url: "^/pdfUpload",
      views: {
        'content@': {
          controller: "pdfUploadController",
          templateUrl: "/components/pdfUpload/pdfUpload.html"
        }
      }
    })
    .state("root.messages", {
      url: "^/messages",
      views: {
        'content@': {
          controller: "messagesController",
          templateUrl: "components/messages/messages.html"
        }
      }
    });
	
});

// don't use '#'s in URLs
angular.module('stc_admin').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);