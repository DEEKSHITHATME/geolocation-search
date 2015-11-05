var ReverseGeocode = function() {
    //This is declaring the Global variables
    var geocoder, map, marker;
    //This is declaring the 'Geocoder' variable
    geocoder = new google.maps.Geocoder();

    function GeoCode(latlng) {
        // This is making the Geocode request
        geocoder.geocode({
            'latLng': latlng
        }, function(results, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                alert(status);
            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status == google.maps.GeocoderStatus.OK) {
                //This is placing the marker at the returned address
                if (results[0]) {
                    // Creating a new marker and adding it to the map
                    map.setZoom(10);
                    marker = new google.maps.Marker({
                        map: map,
                        animation: google.maps.Animation.BOUNCE,
                        // draggable: true,
                    });
                    marker.setPosition(latlng);
                    map.panTo(latlng);
                }
                google.maps.event.addListener(map, "click", function(event) {
                    // get lat/lon of click
                    var clickLat = event.latLng.lat();
                    var clickLon = event.latLng.lng();

                    // show in input box 
                    document.getElementById("Latitude").value = clickLat.toFixed(15);
                    document.getElementById("Longitude").value = clickLon.toFixed(15);

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(clickLat, clickLon),
                        map: map,
                        draggable: true,
                    });
                });

            }

        });

    }
    return {
        Init: function() {

            var latlng = new google.maps.LatLng(12.310666699999999, 76.6136183);
            //This is creating the map with the desired options
            var myOptions = {
                zoom: 5,
                center: latlng,
                mapTypeId: 'roadmap'
            }
            map = new google.maps.Map(document.getElementById('mapa'), myOptions);
            GeoCode(latlng);
        },
        ReverseCode: function() {
            //This is getting the 'Latitude' and 'Longtiude' co-ordinates from the associated text boxes on the HTML form
            var lat = document.getElementById('Latitude').value;
            var lng = document.getElementById('Longitude').value;
            var latlng = new google.maps.LatLng(lat, lng);
            GeoCode(latlng);
        }
    };

}();
