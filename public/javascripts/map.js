function initialize() {
      var latlng = new google.maps.LatLng(12.2983706, 76.61679380000001); 
      var options = {
             zoom: 10,
             center: latlng,
             mapTypeId: google.maps.MapTypeId.ROADMAP,
             mapTypeControl: true,
             mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
             },
      };
  
       map = new google.maps.Map(document.getElementById("mapa"), options);
  
       geocoder = new google.maps.Geocoder();
  
       marker = new google.maps.Marker({ 
         map: map,
         animation: google.maps.Animation.BOUNCE,
         draggable: true,
       });
  
      marker.setPosition(latlng); 
    //      google.maps.event.addListener(marker, "drag", function(){
    //     document.getElementById("long").value=marker.position.toUrlValue();
    //     document.getElementById("lati").value=marker.position.toUrlValue();
    // });
 google.maps.event.addListener(map, "click", function(event) {
        // get lat/lon of click
        var clickLat = event.latLng.lat();
        var clickLon = event.latLng.lng();

        // show in input box 
        document.getElementById("lat").value = clickLat.toFixed(15);
        document.getElementById("lon").value = clickLon.toFixed(15);

          var marker = new google.maps.Marker({
                position: new google.maps.LatLng(clickLat,clickLon),
                map: map,
                draggable: true,
             });
    });

    // keep googlemap responsive - center on resize
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(myLatlng);
    });
}

