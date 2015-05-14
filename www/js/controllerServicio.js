module.controller('ControllerServicio',function($scope,$timeout) {
	      
	$scope.ubicacion ={};
	$scope.servicio ={};
	$scope.servicio_info = {};
	$scope.map;
	$scope.servicioParse = Parse.Object.extend("Servicio");
	$scope.servicios = {};


	

	$scope.mapa = null;
$scope.directionsDisplay = null;
	$scope.directionsService = null;


	document.addEventListener("pageinit", function(e) {
	  if (e.target.id == "crear.html") {
	    $scope.carga_mapa();
	  }
	}, false);

      $scope.mostrar_lista = true;
      $scope.mostrar_mapa = false;

      $scope.mostrarLista = function(){
      	$scope.mostrar_lista = true;
      	$scope.mostrar_mapa = false;
      	console.log("lista");
      }

      $scope.mostrarMapa = function(){
      	$scope.mostrar_mapa = true;
      	$scope.mostrar_lista = false;
      	console.log("mapa");
      	$scope.carga_mapa();
      	
      }
      function getMiUbicacion(){
      	navigator.geolocation.getCurrentPosition(function(position) {
      		$scope.ubicacion.lat = position.coords.latitude;
	    	$scope.ubicacion.lng = position.coords.longitude;
      	});
      }
 	
   
      $scope.submit_search = function(){

      	navigator.geolocation.getCurrentPosition(function(position) {
      		
	    	var query = new Parse.Query($scope.servicioParse);
	    	//var query2 = new Parse.Query($scope.servicioParse);
	    		$scope.ubicacion.lat = position.coords.latitude;
	    		$scope.ubicacion.lng = position.coords.longitude;
	    	 var ubicacion  =new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});

			query.near("ubicacion",ubicacion);
			query.limit(10);
			query.matches("nombre", ".*"+$scope.servicio.search+".*");

			//var mainQuery = Parse.Query.or(query,)
				 //query.matches("nombre", ".*"+$scope.servicio.search+".*");
			query.find({
				success: function(data){
				 		 console.log("Successfully retrieved " + data.length + " scores.");
				 		 
				 		
				 		if($scope.mostrar_mapa){
			    			$scope.map.removeMarkers();

							for (var i = 0; i < data.length; i++) {
					 			var object = data[i];
					 			$scope.map.addMarker({
								  lat: object.get("ubicacion").toJSON().latitude,
								  lng: object.get("ubicacion").toJSON().longitude,
								  click: function(e) {
								    //alert(object.get("nombre"));
								    $scope.mostrar_informacion(object);
								  }
								  
								});
					 			console.log(object.get("ubicacion").toJSON().latitude);
					 		};
			    		}else{
			    			$scope.servicios = data;
			    		}
				 	}
				 });
      	});

	

      	/*getMiUbicacion();

      	 var query = new Parse.Query($scope.servicioParse);
      	 var ubicacion  =new Parse.GeoPoint({latitude: $scope.ubicacion.lat, longitude: $scope.ubicacion.long});
		 query.near("ubicacion",ubicacion);
		 query.limit(10);
		 //query.matches("nombre", ".*"+$scope.servicio.search+".*");
		 query.find({
		 	success: function(data){
		 		// console.log("Successfully retrieved " + data.length + " scores.");
		 		$scope.servicios = data;
		 	}
		 });*/
      }

      $scope.mostrar_informacion = function(s){
		$scope.servicio_info.nombre = s.get("nombre");
		$scope.servicio_info.descripcion = s.get("descripcion");
		$scope.servicio_info.ubicacion = s.get("ubicacion");
		page_servicio.pushPage('informacion_servicio.html', { animation : 'lift' } );
	}

	


	$scope.mostrar_ruta = function(s){
		console.log(s);
		navigator.geolocation.getCurrentPosition(function(position) {
			var myLatlng = new google.maps.LatLng(s.get("ubicacion").toJSON().latitude, s.get("ubicacion").toJSON().longitude);
		    var myOptions = {
		        zoom: 4,
		        center: myLatlng,
		        mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

		    $scope.mapa = new google.maps.Map($("#map").get(0), myOptions);
			$scope.directionsDisplay = new google.maps.DirectionsRenderer();
			$scope.directionsService = new google.maps.DirectionsService();


			var request = {
			        origin: new google.maps.LatLng($scope.ubicacion.lat, $scope.ubicacion.long),
			        destination: new google.maps.LatLng(s.get("ubicacion").toJSON().latitude,s.get("ubicacion").toJSON().longitude),
			        travelMode: google.maps.DirectionsTravelMode["DRIVING"],
			        unitSystem: google.maps.DirectionsUnitSystem["METRIC"],
			        provideRouteAlternatives: true
		    };
			$scope.directionsService.route(request, function(response, status) {
		        if (status == google.maps.DirectionsStatus.OK) {
		            $scope.directionsDisplay.setMap(mapa);
		            $scope.directionsDisplay.setPanel($("#ruta").get(0));
		            $scope.directionsDisplay.setDirections(response);
		        } else {
		            console.log("There is no directions available between these two points");
		        }
		    });

		   
		});
 page_servicio.pushPage('ruta_servicio.html', { animation : 'lift' } );
		

	}

      $scope.carga_mapa = function(){
	      $timeout(function(){
			GMaps.geolocate({
			  success: function(position) {
			   // $scope.map.setCenter(position.coords.latitude, position.coords.longitude);
			    $scope.map = new GMaps({
			        el: '#mapa',
			        lat: position.coords.latitude,
			        lng: position.coords.longitude

			      });


			    /*navigator.geolocation.getCurrentPosition(function(position) {
      		
		    	var query = new Parse.Query($scope.servicioParse);

		    	 var ubicacion  =new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});

				query.near("ubicacion",ubicacion);
				query.limit(1);
				query.matches("nombre", ".*"+$scope.servicio.search+".*");
					 //query.matches("nombre", ".*"+$scope.servicio.search+".*");
				query.find({
					success: function(data){
					 		 //console.log("Successfully retrieved " + data.length + " scores.");
					 		 for (var i = 0; i < data.length; i++) {
					 			var object = data[i];
					 			console.log(object.get("ubicacion").toJSON());
					 		};
					 		$scope.servicios = data;
					 	}
					 });

	      	});*/
						$scope.map.removeMarkers();

							for (var i = 0; i < $scope.servicios.length; i++) {
					 			var object = $scope.servicios[i];
					 			$scope.map.addMarker({
								  lat: object.get("ubicacion").toJSON().latitude,
								  lng: object.get("ubicacion").toJSON().longitude,
								  click: function(e) {
								    //alert(object.get("nombre"));
								    $scope.mostrar_informacion(object);
								  }
								});
					 			console.log(object.get("ubicacion").toJSON().latitude);
					 		};


			    
			  },
			  error: function(error) {
			    //alert('Geolocation failed: '+error.message);
			  },
			  not_supported: function() {
			 
			  },
			  always: function() {

			  }
			});

		     
			
			
		},200);
	  }


});

module.controller('CrearServicio',function($scope,$timeout) {

	$scope.map;

	

      $scope.carga_mapa = function(){
	      $timeout(function(){
			GMaps.geolocate({
			  success: function(position) {
			   // $scope.map.setCenter(position.coords.latitude, position.coords.longitude);
			    $scope.map = new GMaps({
			        el: '#mapa_input',
			        lat: position.coords.latitude,
			        lng: position.coords.longitude,
			        click: function(e){
			        	$scope.map.removeMarkers();
			        	$scope.map.addMarker({
						  lat: e.latLng.lat(),
						  lng: e.latLng.lng()
						  
						});
			        }

			      });
			    
			  },
			  error: function(error) {
			    //alert('Geolocation failed: '+error.message);
			  },
			  not_supported: function() {
			 
			  },
			  always: function() {

			  }
			});

		     
			
			
		},200);
	  }

	$scope.carga_mapa();

});


