var searchBtnInput = document.querySelector('#search-btn');
var searchInput = document.querySelector('#city');
var weatherSection = document.querySelector('.weatherSection .row');

async function myFunction(country) {
    weatherSection.innerHTML = '<p class="text-white text-center">Loading...</p>';

    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ff456200a65f4c35bc5155657251704&q=${country}&days=3&aqi=no&alerts=no`);
    
    if (!response.ok) {
        weatherSection.innerHTML = ''; 
        console.error('Error fetching weather data:', 'City not found or API error');
        return;
    }

    var data = await response.json();

    if (!data || !data.forecast || !data.forecast.forecastday) {
        weatherSection.innerHTML = ''; 
        console.error('Error fetching weather data:', 'No data or forecast available');
        return;
    }

    weatherSection.innerHTML = '';

    for (var i = 0; i < data.forecast.forecastday.length; i++) {
        var day = data.forecast.forecastday[i];
        var weatherCard = document.createElement('div');
        weatherCard.className = 'col-md-4';

        var weatherIconElement;
        var conditionText;
        var isDay;

        if (i === 0) {
            conditionText = data.current.condition.text.toLowerCase();
            isDay = data.current.is_day;
        } else {
            conditionText = day.day.condition.text.toLowerCase();
            isDay = true; 
        }

        if (conditionText.includes('sunny')) {
            weatherIconElement = `<img src="images/sunny.png" alt="${conditionText}" class="my-2 m-auto" style="width: 50px;">`;
        } else if (conditionText.includes('clear') && isDay === 0) {
            weatherIconElement = `<img src="images/moon.png" alt="${conditionText}" class="my-2 m-auto" style="width: 50px;">`;
        } else if (conditionText.includes('cloudy')) {
            weatherIconElement = `<i class="fa-solid fa-cloud my-2 text-white text-center" style="font-size: 40px;"></i>`;
        } else if (conditionText.includes('rain')) {
            weatherIconElement = `<i class="fa-solid fa-cloud-rain my-2 text-white text-center" style="font-size: 40px;"></i>`;
        } else if (conditionText.includes('snow')) {
            weatherIconElement = `<i class="fa-solid fa-snowflake my-2 text-white text-center" style="font-size: 40px;"></i>`;
        } else if (conditionText.includes('partly cloudy')) {
            weatherIconElement = `<i class="fa-solid fa-cloud-sun my-2 text-white text-center" style="font-size: 40px;"></i>`;
        } else {
            weatherIconElement = `<i class="fa-solid fa-question my-2 text-white" style="font-size: 40px;"></i>`;
        }

        if (i === 0) {
            var current = data.current;
            var location = data.location;
            weatherCard.innerHTML = `
                <div class="card text-white p-4">
                    <div class="d-flex justify-content-between">
                        <h5>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h5>
                        <p>${new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                    </div>
                    <hr>
                    <h3 class="h4 text-start mt-2">${location.name}</h3>
                    <h1 class="display-4">${current.temp_c}°C</h1>
                    ${weatherIconElement}
                    <p class="text-white text-center">${current.condition.text}</p>
                    <div class="d-flex justify-content-start gap-4 mt-3">
                        <span><i class="fa-solid fa-tint"></i> ${current.humidity}%</span>
                        <span><i class="fa-solid fa-wind"></i> ${current.wind_kph} km/h</span>
                        <span><i class="fa-solid fa-compass"></i> ${current.wind_dir}</span>
                    </div>
                </div>
            `;
        } else if (i === 1) {
            weatherCard.innerHTML = `
                <div class="card text-center p-4 text-white" style="background-color:#1e202b;">
                    <h5>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h5>
                    <hr>
                    ${weatherIconElement}
                    <h3>${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</h3>
                    <p>${day.day.condition.text}</p>
                </div>
            `;
        } else {
            weatherCard.innerHTML = `
                <div class="card text-center p-4 text-white">
                    <h5>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h5>
                    <hr>
                    ${weatherIconElement}
                    <h3>${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</h3>
                    <p>${day.day.condition.text}</p>
                </div>
            `;
        }
        weatherSection.appendChild(weatherCard);
    }
}

function handleSearch() {
    var country = searchInput.value.trim();
    if (country && /^[a-zA-Z\s]+$/.test(country)) {
        myFunction(country);
    } else {
        weatherSection.innerHTML = '<p class="text-white text-center">Please enter a valid city name.</p>';
    }
}

searchInput.addEventListener('input', handleSearch);

searchBtnInput.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
