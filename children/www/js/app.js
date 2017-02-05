// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngMockE2E', 'firebase', 'credit-cards'])

//constants that will be used everywhere in the app, simplifies the broadcasting of events
// and definition of strings for roles
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  admin: 'admin_role',
  manager: 'manager_role',
  sponsor: 'sponsor_role',
  public: 'public_role'
})


.controller('AppCtrl', function() {})

.controller('DonateCtrl', function($scope) {
   $scope.cardType = {};
   $scope.card = {};

   $scope.makeStripePayment = function(_cardInformation) {

         if (!window.stripe) {
           alert("stripe plugin not installed");
           return;
         }

         if (!_cardInformation) {
           alert("Invalid Card Data");
           return;
         }
         stripe.charges.create({
             // amount is in cents so * 100
             amount: _cardInformation.amount * 100,
             currency: 'usd',
             card: {
               "number": _cardInformation.number,
               "exp_month": _cardInformation.exp_month,
               "exp_year": _cardInformation.exp_year,
               "cvc": _cardInformation.cvc,
               "name": _cardInformation.name
             },
             description: "Stripe Test Charge"
           },
           function(response) {
             if (response.error) {
               alert(response.error.message);
             } else {
               alert("Payment success!");
             }
           }
         );
   }
 })

.controller('ChildCtrl', function($scope, child_array) {
    children = [];

    for (var i = 0; i < child_array.get_length(); i++){
        data = child_array.get_child(i);
        $scope.photourl = data.pop();
        child = [];
        for (var j = 0; j < data.length; j++){
            dictionary = {};
            dictionary.info = data[j];
            child.push(dictionary);
        }
        children.push(child);
    }
    console.log(children);

    $scope.children = children;

})

.controller('LoginCtrl', function($scope, LoginService, sponsorinfoService, child_array , $ionicPopup, $state, $firebase, $http, $rootScope) {

    $scope.data = {};
 	$scope.performCreateAccountRequest = function(){
 		 LoginService.createUser($scope.data.username, $scope.data.password).success(function(data) {
            console.log(data);
            $http({
                method: 'POST',
                url: 'https://save-the-children.herokuapp.com/getUserInfo',
                data: {token: data['token']}
            })


        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Create User failed!',
                template: 'Please check your credentials!'
            });
        });
 	}

    $scope.add_data_child = function(response){
        console.log(response);
        children_ = [];
        //$scope.photourl = response.photo;


        if (response.name != undefined){
            str = "My name is " + response.name;
            children_.push(str);
        }
        if (response.ambition != undefined){
            str = "When I grow up I want to be a " + response.ambition + "!";
            children_.push(str);
        }
        if (response.country != undefined){
            str = "I am from " + response.country;
            children_.push(str);
        }
        if (response.daily_activity != undefined){
            data = response.daily_activity;
            var acts = '';
            for (var i in data){
                acts += data[i];
                if (i < data.length - 1){
                    acts += ", ";
                }
                if (i == data.length -2){
                    acts += " and ";
                }
            }
            str = "Some things I do for fun are " + acts;
            children_.push(str);
        }
        if (response.dob != undefined){
            str = "I was born on " + response.dob;
            children_.push(str);
        }
        if (response.favorite_play != undefined){
            str = "I really like " + response.favorite_play;
            children_.push(str);
        }

        if (response.gender != undefined){
            str = "I am a " + response.gender;
            children_.push(str);
        }
        if (response.household != undefined){
            str = "I live in a " + response.household;
            children_.push(str);
        }
        if (response.language != undefined){
            str = "I speak " + response.language;
            children_.push(str);
        }
        if (response.personality != undefined){
            data = response.personality
            var traits = '';
            for (var i in data){
                traits += data[i];
                if (i < data.length - 1){
                    traits += ", ";
                }
                if (i == data.length -2){
                    traits += " and ";
                }
            }
            str = "I am " + traits;
            children_.push(str);
        }
        if (response.project != undefined){
            str = "I am working on " + response.project;
            children_.push(str);
        }
        if (response.village != undefined){
            str = "I come from " + response.village;
            children_.push(str);
        }

        if (response.photo != undefined){
            children_.push(response.photo);
        }
        return children_;
    }

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            sponsorinfoService.setID(data.sID);
            sponsorinfoService.setToken(data.token);
            $http({
                method: 'POST',
                url: 'https://save-the-children.herokuapp.com/getUserInfo',
                data: {token: data['token']}
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                if (data.success == true) {
                    $state.go('main.home');
                } else {
                //error popup
                }
                console.log(response.data.children);

                for (var key in response.data.children){
                    $http({
                        method: 'POST',
                        url: 'https://save-the-children.herokuapp.com/getChildInfo',
                        data: {id: key}
                    }).then(function successCallback(response) {
                        childID = key;
                        child_data = $scope.add_data_child(response.data);
                        child_array.add_child(child_data);

                        $rootScope.$broadcast('child-data-set');
                      }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                      });
                }
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
            if (data.success == true) {
                $state.go('main.home');
            } else {
                //error popup
            }

        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})


.service('sponsorinfoService', function($q){
     return {
       sponsorID:'',
       sponsorToken: '',
       setID:function(id){
         sponsorID = id;
       },
       setToken: function(tok){
         sponsorToken = tok;
       },
       getID: function(){
         return sponsorID;
       },
       getToken: function(){
         return sponsorToken;
       }
     }
})
.service('LoginService', function($q, $http, $firebase) {
	// This must be in one of the services!
	// Should move after the login so the user doesn't recieve notifications until they log in.
	// TODO: Add user to topics based on their children regions
	// Use data.content to send the actual content. On the push notification body send the
	//		topic of the notification. The content will display when they click the notification

	// This is the notification handler once the app is built for either iOS or Android.
	// Uncomment this section when you build to enable functionality. Serving locally with this
	// uncommented will give an angular error 'cordova is not defined.'
//	FCMPlugin.onNotification(
//				function(data){
//					if(data.wasTapped){
//						//Notification was received on device tray and tapped by the user.
//						alert( JSON.stringify(data.message) );
//					}else{
//						//Notification was received in foreground. Maybe the user needs to be notified.
//						alert( JSON.stringify(data.message)  );
//					}
//				},
//				function(msg){
//					console.log('onNotification callback successfully registered: ' + msg);
//				},
//				function(err){
//					console.log('Error registering onNotification callback: ' + err);
//				}
//	  );

    return {
    	createUser: function(name, pw){
            var deferred = $q.defer();
            var promise = deferred.promise;

            firebase.auth().createUserWithEmailAndPassword(name, pw).then(function(userData){
                    deferred.resolve({success:true,user:userData});
            }).catch(function(error) {
                    deferred.resolve({success:false, error:error.message});
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
    	},

        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            firebase.auth().signInWithEmailAndPassword(name, pw).then(function(user){
                user.getToken().then(function(response){
                        deferred.resolve({success:true,token:response, sID: firebase.auth().currentUser.uid});

                })
            }).catch(function(error) {
                deferred.resolve({success:false, error:error.message});
            })

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
.run(function($httpBackend, $ionicPlatform){
  $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
  $httpBackend.whenPOST(/.*/).passThrough();

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins &&
       window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      window.cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

	// Setting up push notifications

	// This is the notification handler once the app is built for either iOS or Android.
	// Uncomment this section when you build to enable functionality. Serving locally with this
//	// uncommented will give an angular error 'cordova is not defined.'
//	FCMPlugin.getToken(function(token){
//		alert(token);
//	},
//	function(err){
//		console.log('error retrieving token: ' + err);
//	})

  });
})

//USEFUL https://scotch.io/tutorials/create-your-first-mobile-app-with-angularjs-and-ionic

.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {

  $stateProvider

  .state('main', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/main.html'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('main.donate', {
    url: 'main/donate',
    views: {
        'donate-tab': {
          templateUrl: 'templates/donate.html',
          controller: 'DonateCtrl'
        }
    },
    data: {
      authorizedRoles: [USER_ROLES.sponsor]
    },
  })

  .state('main.email', {
    url: 'main/email',
    views: {
        'email-tab': {
          templateUrl: 'templates/email.html',
          controller: 'EmailCtrl'
        }
    },
    data: {
      authorizedRoles: [USER_ROLES.sponsor]
    },
  })
  .state('main.home', {
    url: 'main/home',
    views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
    },
    data: {
      authorizedRoles: [USER_ROLES.sponsor]
    }
  })
  .state('main.child', {
    url: 'main/child',
    views: {
        'child-tab': {
          templateUrl: 'templates/child.html',
          controller: 'ChildCtrl'
        }
    },
    data: {
      authorizedRoles: [USER_ROLES.sponsor]
    }
  });

  /*$urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go('/login');
  });*/

  $urlRouterProvider.otherwise('/login');
})

.controller('HomeCtrl', function($scope, $ionicPopup, $state, $firebase, sponsorinfoService, /*children_info,*/ $rootScope, $ionicModal) {
	$scope.files = [];
	
	
	var getFileNames = function(id, callback){
		var db = firebase.database();
		var lettersRef = db.ref("/letters");
		lettersRef = lettersRef.child(id);
		
		lettersRef.once('value').then(function(snapshot) {
  			var data = snapshot.val();
			callback(data);
		});

	}
	
	console.log('home controller');
	$scope.getLetters = function(){
		console.log(sponsorinfoService.get_id())
	}
	
	$scope.$on('child-data-set',function(event,args){
		// Download pdf		
		var storage = firebase.storage();
		var storageRef = storage.ref();
        // childID is a global var -- super hacky!
		var lettersRef = storageRef.child('letters/' + childID)

		getFileNames(childID, function(files){
			for (var file in files){
				// Filename is files[file]
				lettersRef.child(files[file].fileName).getMetadata().then(function(metadata){
					console.log(metadata);
					var url = metadata.downloadURLs[0];
					var date = new Date(metadata.timeCreated);
					
					$scope.files.push({url:url,date:date.toUTCString()});
					console.log($scope.files);
					$scope.$apply();
				})
			}
	
		});
		
		
	})
	
	$scope.test = function(){
		$rootScope.$broadcast('child-data-set');
	}
	
	/******************* Modal ***********************/
	$ionicModal.fromTemplateUrl('my-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
  	});
	
  	$scope.openModal = function(file) {
		$scope.currentPDF = file;
		$scope.previewFile(file.url);
    	$scope.modal.show();
  	};
	
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};
	
  	// Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
    	$scope.modal.remove();
  	});
	
	/********************* Preview PDF **************************/
	/***************************** PDF Preview Helper ******************************/
	
	  // This is a helper function to preview the pdf. It converts the pdf file read
	  //	in base64 to a uint8 array. This is needed to use the canvas to render the
	  //	file.
	  function base64ToUint8Array(base64) {
		var raw = atob(base64);
		var uint8Array = new Uint8Array(raw.length);
		
		for (var i = 0; i < raw.length; i++) {
			uint8Array[i] = raw.charCodeAt(i);
		}
		
		  return uint8Array;
	  }
	  
	  /***************************** PDF Preview Helper ******************************/
	  
	  // Init the currently viewed page to 1
	  $scope.pageNum = 1
	  
	  // This function renders the next page of the pdf
	  $scope.renderNext = function(){
		  // Loop page numbers when you get to the end
		  if ($scope.pageNum >= $scope.pdf.numPages) {
			  $scope.pageNum = 1;
		  }
		  else
		  	  $scope.pageNum++;
		  
		  $scope.renderPage($scope.pageNum);
	  }
	  
	  // This function renders the previous page of the pdf.
	  $scope.renderPrev = function(){
		  // Loop page number when you get to the beginning
		  if ($scope.pageNum <= 1) {
			  $scope.pageNum = $scope.pdf.numPages;
		  }
		  else
		      $scope.pageNum--;
		  
		  $scope.renderPage($scope.pageNum);
	  }
	  
	  // This function renders a given page of the pdf currently loaded
	  // into the variable $scope.pdf
	  // This var must be initialized with PDFJS
	  $scope.renderPage = function(num){
		  $scope.pdf.getPage(num).then(function(page) {
			  	var scale = 1;
				
			    var unscaledViewport = page.getViewport(scale);

				//
				// Prepare canvas using PDF page dimensions
				//
				var canvas = document.getElementById('pdf');
				var context = canvas.getContext('2d');
				
			  	canvas.width = document.getElementById('modal').offsetWidth;
			  
				var scale = (canvas.width / unscaledViewport.width);
				
			    var viewport = page.getViewport(scale);

				canvas.height = viewport.height;

				
				//
				// Render PDF page into canvas context
				//
				var renderContext = {
				  canvasContext: context,
				  viewport: viewport
				};
				page.render(renderContext);
			    
			    $scope.pdfLoaded = true;
			  	$scope.$apply()
			  });
	  }
	  
	  // This function loads a pdf into PDFJS and renders the page in the html canvas.
	  $scope.previewFile = function(file) {
		  console.log(file);
		  
		  // To read in the pdf file (native html5)
		  var reader  = new FileReader();
		  
		  // Fires once reader reads in the data from the url
		  reader.addEventListener("load", function () {
			// raw base64 data of the PDF
			var raw = reader.result;

			// remove the ASCII header of the data
			var raw = raw.replace("data:application/pdf;base64,", "");
			
			var data = base64ToUint8Array(raw)
			
			// Load data into PDFJS and then render the first page
			// BUG - for some reason the scale for the canvas when you first
			// 		render the pdf is not correct
			PDFJS.getDocument(data).then(function(pdf) {
			  console.log(pdf)
			  console.log('Rendering pdf')
              $scope.pageNum = 1;
		  	  $scope.pdf = pdf;

			  // Using promise to fetch the page
			  $scope.renderPage(1)
				
			});
		  }, false);

		  // if the file has been select, read in the data
		  if (file) {
			console.log('blobifying')
			blobify(file, function(blob){
				$scope.currentPDF.blob = blob;
				var url = window.URL.createObjectURL(blob);
				document.getElementById('save').href = url;
				
				reader.readAsDataURL(blob);
			})
			
		  }
	  }
	  
	  var blobify = function(url, callback){
		  var req = new XMLHttpRequest();
		  req.open('GET', url, true);
		  req.responseType = 'blob';
		  
		  req.onload = function(event){
			  callback(req.response);
		  }
		  
		  console.log('send req')
		  req.send();
	  }
})

.controller('EmailCtrl', function($scope, sendEmailService, $ionicPopup, $state, $firebase) {

    //firebase logic
    var config = {
        method:'POST',
        url:'//correct url',
        //data://put data here
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    };

    //TODO: alert not working
    $scope.showAlert = function() {
        alert('Your Message has been Sent! Check back for a response soon.');
    };

    $scope.showErrorAlert = function() {
        alert('Uh oh, something went wrong. Try again?');
    };

    $scope.sendEmail = function(){
        sendEmailService.sendClientEmail($scope.data.firstname, $scope.data.lastname, $scope.data.email).then(function(data) {
            console.log("hello");

            if (data.success == true) {
                alert('Your Message has been Sent! Check back for a response soon.');

            } else {
                 alert('Uh oh, something went wrong. Try again?');
            }

        })
    };
    $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Your Message has been Sent!',
      template: 'Check back for a response soon.'
    }); };

    $scope.showErrorAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Uh Oh!',
      template: 'Something went wrong. Try Again?'
    }); };
})

.service('sendEmailService', function($q, $http, $firebase, sponsorinfoService, $ionicPopup) {

    showAlert= function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Your Message has been Sent!',
      template: 'Check back for a response soon.'
    }); };

    return {
      sendClientEmail: function(firstname, lastname, emailBody){

            showAlert();
            var deferred = $q.defer();
            var promise = deferred.promise;

            // get sponsor id
            var clientId = sponsorinfoService.getID();

            // get child id TODO: id can't be hardcoded
            var childId = clientId;
            childCountry = "South Africa";

            // create message object
            var msgObj = {from: clientId, regarding: childId, message: emailBody, region: childCountry};

            // get reference to firebase Messages tables
            var db = firebase.database();
            var msgRef = db.ref("/Messages");

            // post data to firebase
            msgRef.push().set(msgObj);

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
      }

    }
})

.service('child_array', function(){
    var array = [];
    return {
        add_child: function(data){
            array.push(data);
        },
        get_child: function(i){
            return array[i];
        },
        get_length: function(){
            return array.length;
        }
    }
});
