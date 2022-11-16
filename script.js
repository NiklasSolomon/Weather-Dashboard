// Declare global variables
var apiKey = "6558d66d693a24a41f1327a05150d2a1";
var rootUrl = 'https://api.openweathermap.org'

// Declare DOM elements
var searchHistory = [];
var searchEl = document.querySelector('#search');
var inputEl = document.querySelector('#input');
var searchHistoryEl = document.querySelector('#history');
var todayEl = document.querySelector('#today');
var forecastEl = document.querySelector('#forecast');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Submit the form to fetch weather information
function renderSearchHistory() {
    searchHistoryEl.innerHTML = '';

    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn', 'btn-history');

        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryEl.append(btn);
    }
};    
    // Fetch the city name from the text <input>
function saveSearch(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
};
    // Call the 'fetchGeolocation' and pass the city name

// Handle button clicks to fetch weather info
function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
};
    // Get the city name from the clicked button's (event.target) data-city attribute
    // Call the 'fetchGeolocation' and pass the city name
function renderCurrentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('MM/DD/YYYY');
    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var header = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvEl = document.createElement('p');
    var uvBadge = document.createElement('button');

    card.setAttribute('class', 'h3 card-title');
    cardBody.setAttribute('class', 'card-text');
    card.append(cardBody);

    header.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    header.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    header.append(weatherIcon);
    tempEl.textContent = `Temperature: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(header, tempEl, windEl, humidityEl);

    uvEl.textContent = 'UV Index: ';
    uvBadge.classList.add('btn', 'btn-sm');

    if (uvi < 3) {
        uvBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uvBadge.classList.add('btn-warning');
    } else {
        uvBadge.classList.add('btn-danger');
    }

    uvBadge.textContent = uvi;
    uvEl.append(uvBadge);
    cardBody.append(uvEl);
    
    todayEl.innerHTML = '';
    todayEl.append(card);
}

function renderForecastEl(forecast, timezone) {
    var unixTs = forecast.dt;
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var temp = forecast.temp.day;
    var wind = forecast.wind_speed;
    var { humidity } = forecast;

    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
    
    cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('MM/DD/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temperature: ${temp} °F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    forecastEl.append(col);
}

function renderForecast(dailyForecast, timezone) {
    var startDate = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDate = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

    var headerCol = document.createElement('div');
    var header = document.createElement('h4');

    headerCol.setAttribute('class', 'col-12');
    header.textContent = 'Weekly Forecast:';
    headerCol.append(header);

    forecastEl.innerHTML = '';
    forecastEl.append(headerCol);

    for (var i = 0; i <dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDate && dailyForecast[i].dt < endDate) {
            renderForecastEl(dailyForecast[i], timezone);
        }
    }
}

function displayObjects(city, data) {
    renderCurrentWeather(city, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);
}

// FETCH geolocation data (Geocoding API)
function fetchGeolocation(location) {
    var requestUrl = `${rootUrl}/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;

    fetch(requestUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            // Access lat and lon from data
            if (!data[0]) {
                alert('Input not recognized');
            } else {
                saveSearch(location);
                // Call fetchOneCall and pass through the lat and lon
                fetchOneCall(data[0]);
            }
        })
        
        .catch(function (err) {
            console.error(err);
        });
}
// FETCH weather data (Onecall API)
function fetchOneCall(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var requestUrl = `${rootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayObjects(city, data);
        });
}

// Save the search history in local storage and render on page
// function saveSearch(location) {
    
// }

// Display the fetched objects
// function displayObjects(city, data)


// Pass location to Geolocation on submit
function handleSearch(e) {
    if (!inputEl.value) {
        return;
    }

    e.preventDefault();
    var location = inputEl.value.trim();
    fetchGeolocation(location);
    inputEl.value = '';
}

function handleClick(e) {
    if (!e.target.matches('.btn-history')) {
        return;
    }
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchGeolocation(search);
}

// fetchOneCall();
initSearchHistory();
searchEl.addEventListener('submit', handleSearch);
searchHistoryEl.addEventListener('click', handleClick);