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
	
	firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
			console.log(firebase.auth().currentUser);	
  		} else {
			console.log("User not logged in.")
		}
});
	
  return {
    // call to authenticate the user with firebase
//    login : function(user, callback) {
//		console.log('logging in')
//		firebase.auth().signInWithEmailAndPassword(user.username, user.password).then(function(user){
//			user.getToken().then(function(response){
//				callback({success:true,token:response});
//			})
//		}).catch(function(error) {
//		    callback({success:false, error:error.message});
//		})
//	},
	// call to log the user out of firebase
    logout: function() {
		console.log(firebase.auth().currentUser);
		
        firebase.auth().signOut().then(function(){
			console.log("Logged Out.");
			document.cookie = "token=" + null;
			
			window.location.reload(true);
		}, function(error){
			console.log("Not logged out.")
			console.log(error);
		});
		
    }
//	// call to create a new user in firebase
//    register: function(user, callback) {
//		  firebase.auth().createUserWithEmailAndPassword(user.username, user.password).then(function(userData){
//			  callback({success:true,user:userData});
//		  }).catch(function(error) {
//			  callback({success:false, error:error.message});
//		  });
//    }
  }
};
