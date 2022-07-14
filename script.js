// Declare global variables
var searchHistory = [];
var weatherApiUrl = 'https://api.openweathermap.org';
var apiKey = "cad0812010082bedc3a2cdcb7db795c2";

// Declare DOM elements
var searchEl = document.querySelector('#search');
var inputEl = document.querySelector('#input');
var searchHistoryEl = document.querySelector('#history');
var todayEl = document.querySelector('#today');
var forecastEl = document.querySelector('#forecast');

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

            // Access lat and lon from data

            // Call fetchOneCall and pass through the lat and lon
        })
}
// FETCH weather data (Onecall API)
function fetchOneCall(lat, lon) {

    var request = `https://api.openweathermap.org/data/2.5/onecall?appid=cad0812010082bedc3a2cdcb7db795c2&lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial`;

    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });
}
fetchOneCall();
