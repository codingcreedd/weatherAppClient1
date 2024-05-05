//FETCH COUNTRIES FROM COUNTRIES.JSON FILE

const countryListElement = document.getElementById('country-list');
let currentTemp = 'Celcius';
let countries = [];

const tempF = document.getElementById('degF');
const tempC = document.getElementById('degC');

fetch('countries.json')
  .then(response => response.json())
  .then(data => {
    countries = data;
    addCountries();
    countries.forEach(country => {
      const listItem = document.createElement('div');
      listItem.classList.add('country-container');

      const countryContainer = document.createElement('p');
      countryContainer.classList.add('countryNameClicker');
      countryContainer.innerText = country.name;

      const starIcon = document.createElement('i');
      starIcon.classList.add('bxs-star');
      starIcon.classList.add('bx');

      listItem.appendChild(countryContainer);
      listItem.appendChild(starIcon);

      countryListElement.appendChild(listItem);

        listItem.firstChild.addEventListener('click', e => {

            if(leftSide.style.transform === 'none'){
                leftSide.style.cssText = "transform: translateX(1000px);";
            }

            todayNav.classList.add('toggledNav');
            favouritesNav.classList.remove('toggledNav');

            if(!favPage.classList.contains('hidden')){
                favPage.classList.add('hidden');
                todayPage.classList.remove('hidden');
            }

            if(!indicatorsSection.classList.contains('hidden')){
                indicatorsSection.classList.add('hidden');
                todayPage.classList.remove('hidden');
            }
        });

        listItem.firstChild.nextSibling.addEventListener('click', (e) => {
            if (e.target && e.target.matches('.bxs-star')) {
                const parentNode = e.target.parentNode;
                const countryNameSpan = parentNode.querySelector('.countryNameClicker').innerText;
                if(e.target.style.color === 'gold'){
                    e.target.style.color = "black";
                    removeFromFavourites(countryNameSpan);
                }
                else{
                    e.target.style.color = "gold";
                    const clonedItem = listItem.cloneNode(true);
                    addToFavourites(countryNameSpan, clonedItem);                
                }
            }
        });

      countryContainer.addEventListener('click', e => {
        const tempF = document.getElementById('degF');
        (tempF.classList.contains('toggledTemp')) ? currentTemp = 'Fahrenheit' : currentTemp = 'Celcius';

        callRenderer(country.name, currentTemp);
      });
    });
  })
  .catch(error => console.error(error));



//FETCH DATA FROM WEATHER API

async function fetchWeatherData(cityName) {
    try {
        const weatherResult = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=37f27913376d45459b7195029241802&q=${cityName}&days=10&aqi=no&alerts=no`, {mode: 'cors'});
        if (!weatherResult.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherResultJson = await weatherResult.json();
        return weatherResultJson;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log("Could not fetch data");
        throw error; 
    }
}

//RUNS AT THE BEGINNING BY DEFAULT
const callRenderer = (country = "Tripoli, Lebanon", currentTemp = "Celcius") => {
    fetchWeatherData(country).then((weatherData) => {
        renderCityCountryName(weatherData);
        renderCityCountryTemp(weatherData, currentTemp);
        renderWeatherInfoAtAllTimes(weatherData, currentTemp);
        // renderDayInfo(weatherData);
        // renderDays(weatherData);
        renderHighlights(weatherData);
    });
};

callRenderer();

//CLICK EVENTS



const searchIcon = document.querySelector('.bx-search-alt-2');
searchIcon.addEventListener('click', () => {
    const inputSearch = document.getElementById('countrySearch').value;
    leftSide.style.cssText = "transform: translateX(1000px);";
    callRenderer(inputSearch, currentTemp);
});

const todayNav = document.getElementById('todayNav');

const todayPage = document.querySelector('.today');
todayNav.addEventListener('click', () => {
    favPage.classList.add('hidden');
    todayPage.classList.remove('hidden');
    todayNav.classList.add('toggledNav');
    favouritesNav.classList.remove('toggledNav');

    tempIndicatorBtn.style.color = "";
    windIndicatorBtn.style.color = "";
    tempIndicatorBtn.classList.remove('hidden');
    windIndicatorBtn.classList.remove('hidden');

    indicatorsSection.classList.add('hidden');

    document.querySelector('.celcTemp').classList.remove('hidden');
    document.querySelector('.fehrTemp').classList.remove('hidden');

});


//FUNCTIONALITIES

function renderCityCountryName(weatherData)
{
    const cityCountryName = document.getElementById('country-name');
    cityCountryName.innerText = `${weatherData.location.name}, ${weatherData.location.country}`;
}

function renderCityCountryTemp(weatherData, currentTemp)
{
    const temp = document.getElementById('temperature');
    (currentTemp === 'Celcius') ? temp.innerText = `${weatherData.current.temp_c}` : temp.innerText = `${((weatherData.current.temp_c * 9/5) + 32).toFixed(2)}`  


    tempF.addEventListener('click', () => {
        if(!tempF.classList.contains('toggledTemp')){
            tempF.classList.add('toggledTemp');
            tempC.classList.remove('toggledTemp');
            currentTemp = 'Fahrenheit';

            const mainTemperature = document.getElementById('temperature');
            const celsius = parseFloat(mainTemperature.innerText);
            const fahrenheit = ((celsius * 9/5) + 32).toFixed(2);

            mainTemperature.innerText = `${fahrenheit}`;

            const tempHour = document.querySelectorAll('.tempHour');

            tempHour.forEach(hourTemp => {
                hourTemp.innerText = `${parseFloat((hourTemp.innerText * 9/5 + 32).toFixed(2))}`;
            });
        }
    });

    tempC.addEventListener('click', () => {
        if(!tempC.classList.contains('toggledTemp')){
            tempC.classList.add('toggledTemp');
            tempF.classList.remove('toggledTemp');
            currentTemp = 'Celcius';

            const mainTemperature = document.getElementById('temperature');
            const fahrenheit = parseFloat(mainTemperature.innerText);
            const celcius = ((fahrenheit - 32) * 5/9).toFixed(2);

            mainTemperature.innerText = `${celcius}`;

            const tempHour = document.querySelectorAll('.tempHour');

            tempHour.forEach(hourTemp => {
                hourTemp.innerText = `${parseFloat(((hourTemp.innerText - 32) * 5/9).toFixed(2))}`;
            });

        }
    }); 

}

//TIMES
function renderWeatherInfoAtAllTimes(weatherData, currentTemp){
    const currentHour = new Date().getHours(); 
    const hours = getForcastDay(weatherData).hour;
    let startIndex = hours.findIndex(hourData => parseInt(hourData.time.split(' ')[1]) >= currentHour);
  
    if (startIndex === -1) {
        startIndex = 0;
    }

    const weatherInfoComponents = document.querySelectorAll('.hour');
    const weatherInfoComponentsArray = Array.from(weatherInfoComponents);

    let j = 0;
    for (let i = startIndex; i < startIndex + 24; i++) {
        const hourData = hours[i % hours.length];
        const time = extractTime(hourData.time);
        const timeIn12HourFormat = convertTo12HourClock(time);
        const icon = hourData.condition.icon;
        let temperature;
        (currentTemp === 'Celcius') ? temperature = hourData.temp_c : temperature = ((hourData.temp_c * 9/5) + 32).toFixed(2);
        
        updateWeatherInfo(timeIn12HourFormat, icon, temperature, weatherInfoComponentsArray[j++]);
    }
}

function extractTime(datetime) {
    return datetime.split(' ')[1];
}

function convertTo12HourClock(time) {
    const [hours, minutes] = time.split(':');

    let hours12 = parseInt(hours);

    if (hours12 > 12) {
        hours12 -= 12;
    }

    if (hours12 === 0) {
        hours12 = 12;
    }

    const period = hours < 12 ? 'AM' : 'PM';

    return `${hours12}:${minutes} ${period}`;
}

function getForcastDay(weatherData)
{
    const currentDay = new Date().toISOString().split('T')[0];
    const forecastData = weatherData.forecast.forecastday;
    const currentDayForecast = forecastData.find(day => day.date === currentDay);
    return currentDayForecast;
}

function updateWeatherInfo(time, icon, temperature, component) {
    component.querySelector('#time').textContent = `${time}`;
    component.querySelector('#icon').src = `${icon}`;
    component.querySelector('#tempHour').innerHTML = `${temperature}`; 
}


//HIGHLIGHTS

function renderHighlights(weatherData) {

    document.getElementById('uv-index').innerText = weatherData.current.uv;
    document.getElementById('uv-index-level').innerText = getUVIndexLevel(weatherData.current.uv);

    document.getElementById('wind-status').innerText = weatherData.current.wind_kph;
    document.getElementById('wind-speed').innerText = 'km/h';

    document.getElementById('sunrise').innerText = weatherData.forecast.forecastday[0].astro.sunrise;
    document.getElementById('sunset').innerText = weatherData.forecast.forecastday[0].astro.sunset;

    document.getElementById('humidity').innerText = weatherData.current.humidity + '%';
    document.getElementById('humidity-level').innerText = getHumidityLevel(weatherData.current.humidity);

    document.getElementById('visibility').innerText = weatherData.current.vis_km;
    document.getElementById('visibility-level').innerText = getVisibilityLevel(weatherData.current.vis_km);

    document.getElementById('gust').innerText = `${weatherData.current.gust_kph}`;
}

function getUVIndexLevel(uvIndex) {
    return (uvIndex < 3) ? 'Low' : (uvIndex < 6) ? 'Moderate' : (uvIndex < 8) ? 'High' : 'Very High';
}

function getHumidityLevel(humidity) {
    return (humidity < 30) ? 'Low' : (humidity < 60) ? 'Moderate' : 'High';
}

function getVisibilityLevel(visibility) {
    return (visibility < 1) ? 'Very Low' : (visibility < 5) ? 'Low' : (visibility < 10) ? 'Moderate' : 'High';
}


//----------------------------------------------------------FAVOURITES--------------------------------------------------------//


const favourites = [];
const favouritesNav = document.getElementById('favNav');
const favPage = document.querySelector('.favourites-section');

favouritesNav.addEventListener('click', () => {
    //hide current page
    todayPage.classList.add('hidden');
    favPage.classList.remove('hidden');
    indicatorsSection.classList.add('hidden');
    tempIndicatorBtn.style.color = "";
    windIndicatorBtn.style.color = "";
    tempIndicatorBtn.classList.add('hidden');
    windIndicatorBtn.classList.add('hidden');
    
    todayNav.classList.remove('toggledNav');
    favouritesNav.classList.add('toggledNav');
    
    document.querySelector('.celcTemp').classList.add('hidden');
    document.querySelector('.fehrTemp').classList.add('hidden');

});

function addToFavourites(countryNameSpan, clonedItem){
    if(!favourites.includes(countryNameSpan)){
        favourites.push(countryNameSpan);
        clonedItem.classList.remove('country-container');
        clonedItem.classList.add('favCountry');
        clonedItem.setAttribute('data-country', countryNameSpan);
        favPage.appendChild(clonedItem);

        const starIcon = clonedItem.querySelectorAll('.favCountry .bx.bxs-star');
        starIcon.forEach(star => {
            star.addEventListener('click', () => {
                removeFromFavourites(star.parentNode.querySelector('.countryNameClicker').innerText);
                const starIconLeft = document.querySelectorAll('.country-list .country-container .bxs-star');
                starIconLeft.forEach(starLeft => {
                    if(starLeft.parentNode.querySelector('.countryNameClicker').innerText === countryNameSpan){
                        starLeft.style.color = "black";
                    }
                });
            });
        })

        clonedItem.firstChild.addEventListener('click', () => {
            let countryName = clonedItem.querySelector('.countryNameClicker').innerText;
            showCountryDetails(countryName);
        });

    }
}

function removeFromFavourites(countryNameSpan){
    if(favourites.includes(countryNameSpan)){
        favourites.splice(favourites.indexOf(countryNameSpan), 1);
        const clonedItemToRemove = document.querySelector(`.favCountry[data-country="${countryNameSpan}"]`);
        if(clonedItemToRemove){
            clonedItemToRemove.remove();
        }
    }
}

function showCountryDetails(countryName){
    favPage.classList.add('hidden');
    todayPage.classList.remove('hidden');
    favouritesNav.classList.remove('toggledNav');
    todayNav.classList.add('toggledNav');

    tempIndicatorBtn.classList.remove('hidden');
    windIndicatorBtn.classList.remove('hidden');
    tempC.classList.remove('hidden');
    tempF.classList.remove('hidden');

    callRenderer(countryName);
}



//-----------------------------------------------------INDICATORS------------------------------------------------//

const indicatorsSection = document.querySelector('.indicators-section');
const tempIndicatorSection = document.querySelector('.tempIndicators');
const windIndicatorSection = document.querySelector('.windIndicators');

const tempIndicatorBtn = document.getElementById('tempIndicator');
const windIndicatorBtn = document.getElementById('windIndicator');


//-------------------------------------------------MENU---------------------------------------------------------//

const menu = document.querySelector('.bx.bx-menu');
const closeMenu = document.querySelector('.bx.bxs-exit');
const leftSide = document.querySelector('.left-side');
    
menu.addEventListener('click', () => {
    leftSide.style.display = 'flex';
    leftSide.style.transform = 'none'; 
});

closeMenu.addEventListener('click', () => {
    leftSide.style.display = 'none';
});

window.addEventListener('resize', () => {
    if(document.documentElement.clientWidth > 850){
        leftSide.style.display = 'flex'
        leftSide.style.transform = 'none';
    }
    else if(document.documentElement.clientWidth <= 850){
        leftSide.style.cssText = 'transform: translateX(1000px);';
    }
})



// searchIcon.addEventListener

