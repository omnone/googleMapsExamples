//this global function is called whenever you have an authentication error in googles apis
function gm_authFailure() {
  alert("Did you change the API key?\n\n"+"Please check index.html");
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.initMap = function() {
    //set the default center of the map
    var myLatlng = new google.maps.LatLng(37.983810, 23.727539);
    var mapOptions = {
        zoom: 4,
        center: myLatlng
    }
    
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Place a draggable marker on the map
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true,
        title: "Drag me!"
    });

    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow;
    var adress_find = "";
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //get the address from the markers data
    //This function takes lat and lng from marker and translates it to an address
    function geocodeLatLng(geocoder, map, infowindow, marker) {
      
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        
        var input = lat + "," + lng;
        
        var latlngStr = input.split(',', 2);
        var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
        
        geocoder.geocode({ 'location': latlng }, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    //print the address you found
                    document.getElementById('current').innerHTML = results[0].formatted_address;
                    adress_find = results[0].formatted_address;
                    document.getElementById("address").value = adress_find;
                    map.setZoom(16);
                     
                    //update the info window of the marker with the new address
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //get the address and find the place on the map
    //This function takes an address and calculates the lat and lng .
    function geocodeAddress(geocoder, marker, map) {
        var address = document.getElementById('address').value;
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                document.getElementById('current').innerHTML = results[0].formatted_address;
              
                //update the info window of the marker with the new address
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);

                marker.setPosition(results[0].geometry.location);
                map.setZoom(16);

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //everytime the marker is dragged find the new address
    google.maps.event.addListener(marker, 'dragend', function(evt) {
        geocodeLatLng(geocoder, map, infowindow, marker);
    });
    
    //on submit find the  new address 
    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, marker, map);
    });

}
