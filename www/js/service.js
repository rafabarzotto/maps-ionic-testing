angular.module('service.api', [])
	.factory('service', function($ionicLoading, $cordovaGeolocation) {

		var latLngIni = new google.maps.LatLng(-27.024354, -50.917810); //videira
		var latLngFim = new google.maps.LatLng(-27.217713, -50.976790); //monte carlo

		var _inicializar = function() {
			var options = {
				timeout: 10000,
				enableHighAccuracy: true
			};

			var mapOptions = {
				center: latLngIni,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("map"), mapOptions);

			//window.sessionStorage.setItem('posInicial', angular.toJson(latLngIni));
		};

		var _verifyPoints = function() {
			var request = {
				location: latLngIni,
				radius: '200',
				types: ['store']
			};

			var ps = new google.maps.places.PlacesService(map);
			ps.nearbySearch(request, callback);
		};

		function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					createMarker(results[i]);
				}
			}
		};

		function createMarker(place) {
			var placeLoc = place.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
			});

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(place.name);
				infowindow.open(map, this);
			});
		};

		var _verifyDistance = function(origin, destine) {
			var dms = new google.maps.DistanceMatrixService();
			getDistance = dms.getDistanceMatrix({
				origins: [origin],
				destinations: [destine],
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.METRIC,
				avoidHighways: false,
				avoidTolls: false,
			}, callbackDms);
		};

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
					alert("Distancia de: " + distance);
				}
			}
		};

		var _getPosition = function() {
			if (!map) {
				return;
			}

			var options = {
				timeout: 10000,
				enableHighAccuracy: true
			};

			loading = $ionicLoading.show({
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

				map = new google.maps.Map(document.getElementById("map"), mapOptions);

				var marker = new google.maps.Marker({
					map: map,
					animation: google.maps.Animation.DROP,
					position: latLng
				});

			window.sessionStorage.setItem('CurrentPosition', angular.toJson(latLng));

				loadingHide = $ionicLoading.hide();


			}, function(error) {
				console.log("Não Foi Possivel encontrar localização ou o disposito não é compativel");
			});
		};

		return {
			inicializar: _inicializar,
			verifyPoints: _verifyPoints,
			verifyDistance: _verifyDistance,
			getPosition: _getPosition
		};

	});