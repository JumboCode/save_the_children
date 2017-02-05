// public/shared/Authentication/AuthenticationService.js

angular.module('stc_admin.authentication').factory('AuthenticationService', ['$http', '$state', '$window', '$rootScope', AuthenticationService]);
  
function AuthenticationService($http, $state, $window, $rootScope) {

	var config = {
		apiKey: "AIzaSyCAHIw0DjNJ9U4oge0wNHhhNpZjNGTJkVQ",
		authDomain: "save-the-children-b5ef0.firebaseapp.com",
		databaseURL: "https://save-the-children-b5ef0.firebaseio.com",
		storageBucket: "save-the-children-b5ef0.appspot.com",
		messagingSenderId: "391660661794"
	};
  
	firebase.initializeApp(config);
  
  // This function ensures that the user is authenticated before going into the actual app.
  // If the user is not authentic then it reroutes the user to login again
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
	  	// Check if user is authorized
	    console.log('Checking auth: ', firebase.auth().currentUser)
		
		// Perform authentication check
		if (!firebase.auth().currentUser){
			// Redirect to login (if statement to prevent infinite redirect)
			if (!toState.name.includes('authentication'))
				window.location.href = '/login';
		}
  })
	
  return {
    // call to authenticate the user with firebase
    login : function(user, callback) {
		console.log('logging in')
		firebase.auth().signInWithEmailAndPassword(user.username, user.password).then(function(user){
			user.getToken().then(function(response){
				callback({success:true,token:response});
			})
		}).catch(function(error) {
		    callback({success:false, error:error.message});
		})
	},
	// call to create a new user in firebase
    register: function(user, callback) {
		  firebase.auth().createUserWithEmailAndPassword(user.username, user.password).then(function(userData){
			  callback({success:true,user:userData});
		  }).catch(function(error) {
			  callback({success:false, error:error.message});
		  });
    }
  }
};
