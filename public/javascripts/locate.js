if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert('Your browser does not support geolocation.');
}

function success(position) {
    console.log(position);
    var lat = document.getElementById('Latitude'),
        lon = document.getElementById('Longitude');
    lat.value = position.coords.latitude;
    lon.value = position.coords.longitude;
}

function error(err) {
    alert(err);
}
