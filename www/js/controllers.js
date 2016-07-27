angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);

  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [{
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('MapCtrl', function($scope, service) {

  var latLngIni = new google.maps.LatLng(-27.024354, -50.917810);
  var latLngFim = new google.maps.LatLng(-27.217713, -50.976790);


  service.inicializar();

  //service.verifyPoints();

  $scope.centerOnMe = function() {
    service.getPosition();
    var data = angular.fromJson(sessionStorage.getItem('CurrentPosition'));
    var teste = new google.maps.LatLng(data);
    service.verifyDistance(teste, latLngFim);
  }


})

.controller('BarcodeCtrl.api', function($scope, $cordovaBarcodeScanner) {

  document.addEventListener("deviceready", function() {

    $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
      }, function(error) {
        // An error occurred
      });


    // NOTE: encoding not functioning yet
    $cordovaBarcodeScanner
      .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
      .then(function(success) {
        // Success!
      }, function(error) {
        // An error occurred
      });

  }, false);
});