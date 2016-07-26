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

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading) {

  var latLngIni = new google.maps.LatLng(-27.024354, -50.917810);
  var latLngFim = new google.maps.LatLng(-27.217713, -50.976790);

  //INICIAR MAPA
  inicializar();

  function inicializar() {
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    var mapOptions = {
      center: latLngIni,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

   // verifyPoints();
    verifyDistance(latLngIni, latLngFim);

  }

  function verifyDistance(origin, destine) {
    var dms = new google.maps.DistanceMatrixService();
    getDistance = dms.getDistanceMatrix({
      origins: [origin],
      destinations: [destine],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    }, callbackDms);
  }

  function callbackDms(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          // var duration = element.duration.text;
          // var from = origins[i];
          // var to = destinations[j];
        }
        alert("Distancia até o hotspot: " + distance);
      }
    }
  }

  function verifyPoints() {
    var request = {
      location: latLngIni,
      radius: '200',
      types: ['store']
    };

    var ps = new google.maps.places.PlacesService($scope.map);
    ps.nearbySearch(request, callback);
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: place.geometry.location

    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

  $scope.centerOnMe = function() {
    if (!$scope.map) {
      return;
    }

    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    $scope.loading = $ionicLoading.show({
      template: 'Getting current location...',
      showBackdrop: false
    }).then(function() {
      console.log("The loading indicator is now displayed");
    });


    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {


      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      $scope.loadingHide = $ionicLoading.hide();


      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function() {

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLngIni
        });

        var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open($scope.map, marker);
        });

      });

      verifyDistance(LatLng, latLngFim);

    }, function(error) {
      alert("Não Foi Possivel encontrar localização");
    });
  }


});