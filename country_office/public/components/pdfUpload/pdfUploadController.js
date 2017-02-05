angular.module('stc_admin.pdfUpload').controller('pdfUploadController', ['$scope', '$state', '$http', '$mdDialog',
  function ($scope, $state,$http,$mdDialog) {
	  
	  // This determines if the upload and select pdf buttons are visible.
	  $scope.validChildId = false; 
      
	  /**************************** Helper Functions ********************************/

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
	  
	  /**************************** Child Id Validation *****************************/
      $scope.checkId = function(){
		  console.log("checking id")
		  var office = 'China';
		  var token = window.sessionStorage.authToken;
		  
		  var promise = $http.post('https://save-the-children.herokuapp.com/validChildIdFromOffice',{data:{childId:$scope.childId, office:office, token:token}});
		  
		  promise.then(function successCallback(response) {
				$scope.showAlert("Child Id valid");
			  	$scope.validChildId = true;
            }, function errorCallback(response) {
				$scope.showAlert("Invalid Child Id.",response.data);
          });
		  
      }
	  
      /**************************** File Upload Helper **************************/
      var addFileToDB = function(path, callback){
          var db = firebase.database();
          var childID = path.split('/')[1];
          var fileName = path.split('/')[2];
        
          var childLetterRef = db.ref("/letters/" + childID);
          // post data to firebase
          childLetterRef.push().set({fileName:fileName});
        
          callback();
      }
      
	  /**************************** PDF File Upload *****************************/
      $scope.uploadPDF = function(){
		 var file    = document.querySelector('input[type=file]').files[0];
         var storage = firebase.storage();
         var storageRef = storage.ref();
         var path = 'letters/' + $scope.childId + '/' + Date.now();
         var lettersRef = storageRef.child(path);;
         lettersRef.put(file).then(function(snapshot) {
                addFileToDB(path, function(){
                    $scope.showAlert("File Uploaded Successfully.");
                })
         })
      }

      $scope.btnSubmit = function() {
      	submit.style.visbility="visible";
      }
	  
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
				var canvas = document.getElementById('the-canvas');
				var context = canvas.getContext('2d');
			  
                canvas.width = $(".form").width()
                
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
	  $scope.previewFile = function() {
		  
		  // Must get the file object and not just the name.. IMPORTANT
		  var file    = document.querySelector('input[type=file]').files[0];
		  
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
		  	  $scope.pdf = pdf;
			  // Using promise to fetch the page
			  $scope.renderPage(1)
				
			});
		  }, false);

		  // if the file has been select, read in the data
		  if (file) {
			reader.readAsDataURL(file);
		  }
	  }
	  
  }
]);