angular.module('serviceMaps.api', [])
	.factory('inicializarMaps', function() {

		var latLngIni = new google.maps.LatLng(-27.024354, -50.917810);
		var latLngFim = new google.maps.LatLng(-27.217713, -50.976790);

		//INICIAR MAPA
		//inicializar();

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

			// console.log(verifyPoints());
			//verifyDistance(latLngIni, latLngFim);
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
			return true;
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
	});