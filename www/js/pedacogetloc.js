.then(function(position) {

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

				loadingHide = $ionicLoading.hide();

				//Wait until the map is loaded
				google.maps.event.addListenerOnce(map, 'idle', function() {

					var marker = new google.maps.Marker({
						map: map,
						animation: google.maps.Animation.DROP,
						position: latLngIni
					});

					var infoWindow = new google.maps.InfoWindow({
						content: "Here I am!"
					});

					google.maps.event.addListener(marker, 'click', function() {
						infoWindow.open(map, marker);
					});
				});
			}, function(error) {
				console.log("Não Foi Possivel encontrar localização ou o disposito não é compativel");
			});