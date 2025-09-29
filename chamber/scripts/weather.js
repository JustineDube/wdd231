const apiKey = '15ac4d499a11f1eda8e14004ea7457c8'; 
const city = 'Bulawayo';
const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=Bulawayo&units=metric&appid=15ac4d499a11f1eda8e14004ea7457c8
`;

const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const forecastContainer = document.getElementById('forecast');

fetch(weatherURL)
    .then((response) => response.json())
    .then((data) => {
        // Current weather (first item)
        const current = data.list[0];
        const temp = Math.round(current.main.temp);
        const desc = current.weather[0].description;

        currentTemp.textContent = `Temperature: ${temp}°C`;
        weatherDesc.textContent = `Conditions: ${desc}`;

        // 3-day forecast
        forecastContainer.innerHTML = '<h3>3-Day Forecast:</h3>';
        const forecastDays = {};

        data.list.forEach((item) => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

            if (!forecastDays[day] && date.getHours() === 12) {
                forecastDays[day] = item;
            }
        });

        let count = 0;
        for (let key in forecastDays) {
            if (count >= 3) break;
            const f = forecastDays[key];
            const temp = Math.round(f.main.temp);
            const desc = f.weather[0].description;

            const forecastEl = document.createElement('p');
            forecastEl.textContent = `${key}: ${temp}°C, ${desc}`;
            forecastContainer.appendChild(forecastEl);

            count++;
        }
    })
    .catch((error) => {
        console.error('Error fetching weather data:', error);
        currentTemp.textContent = 'Weather unavailable';
    });