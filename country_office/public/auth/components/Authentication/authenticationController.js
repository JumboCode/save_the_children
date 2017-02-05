angular.module('stc_admin.authentication').controller('AuthenticationController', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {	  
	  $scope.login = function(user){		  
		  console.log("Logging In: ", user)
		  
		  AuthenticationService.login(user,function(response){
		  	console.log(response)
		  
			// save firebase auth token
			if (response.success){
				console.log(response.token)
				window.sessionStorage.authToken = response.token;
				
				// Store token as cookie
				console.log("Setting Cookie");
				document.cookie = "token=" + response.token;
				
				window.location.reload(true);

			} else {
				$scope.reserror = response.error;
				$scope.$apply();
			}
		  });
	  }
	  $scope.register = function(user) {
		  console.log(user);
		  AuthenticationService.register(user, function(response) {
			if (!response.success){
				$scope.reserror = response.error;
				$scope.$apply();
			}
			else
				window.location.reload(true);
		  });
	  }
  }
]);