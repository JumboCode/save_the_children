module.exports = function(app,firebase,db){
	
	// Determine if user is authentic before emitting message
	var isAuthentic = function(token, successCallback, errorCallback){		
		firebase.auth().verifyIdToken(token).then(function(decodedToken) {
	  		successCallback(decodedToken);
		}).catch(function(error) {
	  		console.log(error);
	  		errorCallback();
		});
	}
	
	// Determine auth level of given user id. This is queried from
	// the salesforce database. The results can either be 'admin',
	// 'office' or null as of now. This corresponds to a site admin,
	// a country office manager, or authentication data is not available.
	var AuthLevel = function(uid, callback){
		// Firebase accounts ref
		var accountsRef = db.ref("/Accounts");
							
		// Get the data stored in accounts
		accountsRef.once('value').then(function(snapshot) {
			// extract object from snapshot
			var accounts = snapshot.val();
					
			console.log(uid);
			
			// Determine if user has account and what their auth level is set to
			for (var user in accounts){
				if (uid == user){
					callback(accounts[user].permissions);
					return;
				}
			}
			
			callback(null);

		});
	}
	
	// Must GO LAST or else it intercepts get and post requests
	// This routes all requests to the proper angular index.js file
  	app.get('*', function(req, res) {
		// Auth token stored in cookies
		var token = req.cookies.token;
		
		console.log("Token:", token);
		
		// Route user to auth page if token is undefined
		if (token == undefined){			
			res.sendFile('/public/auth/index.html', { root: __dirname + '/..' });
			return;
		}
		
		// Determine if token is authentic and decode user info
		isAuthentic(token, function(user){
			console.log("User is Authentic:");
			
			// Determine users auth level
			AuthLevel(user.uid, function(permissions){
				console.log(permissions);
				
				// Admin level permissions
				if (permissions == "admin"){
					res.sendFile('/public/app-admin/index.html', { root: __dirname + '/..' });
					return;
				}
				// Office level permissions
				else if (permissions == "office"){
					res.sendFile('/public/app-office/index.html', { root: __dirname + '/..' });
					return;
				}
				// Otherwise return to login
				else {
					res.sendFile('/public/auth/index.html', { root: __dirname + '/..' });
					return;
				}
				
			});
			
		}, function(){		// The user is not authentic
			console.log("ERROR: User is not authentic.");
			
			// Route to auth page.
			res.sendFile('/public/auth/index.html', { root: __dirname + '/..' });
			return;
			
		})
		
		
	});
}

