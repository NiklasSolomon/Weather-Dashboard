var apiKey = "cad0812010082bedc3a2cdcb7db795c2";

// Submit the form to fetch weather information
    
    // Fetch the city name from the text <input>

    // Call the 'fetchGeolocation' and pass the city name

// Handle button clicks to fetch weather info

    // Get the city name from the clicked button's (event.target) data-city attribute

    // Call the 'fetchGeolocation' and pass the city name

// FETCH geolocation data (Geocoding API)
function fetchGeolocation( cityName ) {

    var request = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=cad0812010082bedc3a2cdcb7db795c2`;

    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
}
// FETCH weather data (Onecall API)
function fetchOneCall() {

    var request = "https://api.openweathermap.org/data/2.5/onecall?appid=cad0812010082bedc3a2cdcb7db795c2&lat=40.7596198&lon=-111.8867975&exclude=minutely,hourly&units=imperial";

    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });
}
fetchOneCall();
