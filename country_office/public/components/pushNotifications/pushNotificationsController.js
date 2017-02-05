angular.module('stc_admin.push').controller('PushController', ['$scope', '$state', '$http', '$mdDialog',
  function ($scope, $state, $http, $mdDialog) {
	  
	  /**************************** Init and Helpers ******************************/
	  
	  // Init popover element
	  $('[data-toggle="popover"]').popover({trigger:"hover"})
	  
	  // This function displays an alert on the page.
	  $scope.showAlert = function(title,content) {
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		$mdDialog.show(
		$mdDialog.alert()
			.parent(angular.element(document.querySelector('#popupContainer')))
			.clickOutsideToClose(true)
			.title(title)
			.textContent(content)
			.ariaLabel('Alert Dialog Demo')
			.ok('Got it!')
			.targetEvent('')
		);
	  };
	  
	  // Set the push regions here. They will be displayed in the HTML dropdown selector
	  $scope.regions = [
		  {value:"north_east_us", name:'North East US'},
		  {value:"all", name:'All Users'}
	  ]
	 
	  
	  /**************************** Post Notification to Server ******************************/
	  
	  // This function posts a message to the server.
	  // $scope.message, $scope.push_region, and $scope.title must be set
	  $scope.emitMessage = function(){
		  var message = $scope.message
		  var region = $scope.push_region.value
		  var title = $scope.title
		  var body = $scope.message
		  
		  console.log(message,region,title)
		  
		  // Post notification to server. Request body must include 'token', 'region', 'title', and 'message' members.
	   	  var promise = $http.post('https://save-the-children.herokuapp.com/post_notification',{ params:{ user:window.sessionStorage.authToken},data:{token:window.sessionStorage.authToken, message:message, regions:[region], title:title, body:body}})
          
		  promise.then(function successCallback(response) {
		      $scope.showAlert("Message has been sent successfully");
          }, function errorCallback(response) {
			  if (response.data && response.data.error)
			  	  $scope.showAlert("Message failed to send.",response.data.error);
			  else
				  $scope.showAlert("Message failed to send.");
          });
		  
	  }

  }
]);