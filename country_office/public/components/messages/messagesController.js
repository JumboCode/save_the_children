angular.module('stc_admin.messages').controller('messagesController', ['$scope', '$state', 
  function ($scope, $state) {
   
//    $scope.ReceivedMessages = function() {
        $scope.messages = [];
        var database = firebase.database();
        database.ref('Messages').once('value').then(function(snapshot) {
            snapshot.forEach(function(childsnapshot) {
            $scope.from = childsnapshot.val().from; 
            $scope.message = childsnapshot.val().message;
            $scope.regarding = childsnapshot.val().regarding;
            $scope.region = childsnapshot.val().region;
            $scope.subject = childsnapshot.val().subject;
        //});
        var message = {};
            message.from = $scope.from;
            message.message = $scope.message;
            message.regarding = $scope.regarding;
            message.region = $scope.region;
            message.subject = $scope.subject;

        $scope.messages.push(message);
        console.log($scope.messages);
        $scope.$apply();
            });
        });    
    $scope.setMessage =function(message) {
        $scope.currentMessage = message;
    }
  }    
    //$scope.displayMsg = function() {
//    }       
                    
  ]);
