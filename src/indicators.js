tempIndicatorBtn.addEventListener('click', () => {
    if(!todayPage.classList.contains('hidden')){
        todayPage.classList.add('hidden');
        indicatorsSection.classList.remove('hidden');
    }

    windIndicatorSection.classList.add('hidden');
    tempIndicatorSection.classList.remove('hidden');
    todayNav.classList.remove('toggledNav');
    favouritesNav.classList.remove('toggledNav');

    tempC.classList.add('hidden');
    tempF.classList.add('hidden');

    tempIndicatorBtn.style.color = "gold"
    if(windIndicatorBtn.style.color === "rgb(0, 132, 255)"){
        windIndicatorBtn.style.color = "rgb(85, 85, 85)";
    }
});

windIndicatorBtn.addEventListener('click', () => {
    if (!todayPage.classList.contains('hidden')) {
        todayPage.classList.add('hidden');
        indicatorsSection.classList.remove('hidden');
    }

    tempIndicatorSection.classList.add('hidden');
    windIndicatorSection.classList.remove('hidden');
    todayNav.classList.remove('toggledNav');
    favouritesNav.classList.remove('toggledNav');

    tempC.classList.add('hidden');
    tempF.classList.add('hidden');

    windIndicatorBtn.style.color = "rgb(0, 132, 255)";
    if (tempIndicatorBtn.style.color === "gold") {
        tempIndicatorBtn.style.color = "#4242ff";
    }
});

function addCountries(){
    countries.forEach(country => {
        fetchWeatherData(country.name).then(weatherData => {
            addCountriesTempIndicators(weatherData, country.name);
            addCountriesWindIndicators(weatherData, country.name);
        });
    });
}

function addCountriesTempIndicators(weatherData, countryName){
    const tempCountryDiv = document.createElement('div');
    tempCountryDiv.classList.add('tempCountryDiv');

    const h1 = document.createElement('h1');
    h1.textContent = `${countryName}`;
    tempCountryDiv.appendChild(h1);

    const hr = document.createElement('hr');
    tempCountryDiv.appendChild(hr);

    const tempDiv = document.createElement('div');
    tempDiv.classList.add('tempDiv');

    const tempImage = document.createElement('img');
    tempImage.src = weatherData.current.condition.icon; 
    tempImage.alt = 'Temperature';
    tempDiv.appendChild(tempImage);

    const tempValue = document.createElement('h2');
    tempValue.textContent = `${weatherData.current.temp_c}°C`; 
    tempDiv.appendChild(tempValue);

    tempCountryDiv.appendChild(tempDiv);
 
    tempIndicatorSection.appendChild(tempCountryDiv);
}


function addCountriesWindIndicators(weatherData, countryName){
    const windCountryDiv = document.createElement('div');
    windCountryDiv.classList.add('windCountryDiv');

    const h1 = document.createElement('h1');
    h1.textContent = `${countryName}`;
    windCountryDiv.appendChild(h1);

    const hr = document.createElement('hr');
    windCountryDiv.appendChild(hr);

    const windDiv = document.createElement('div');
    windDiv.classList.add('windDiv');

    const windImage = document.createElement('img');
    windImage.src = (weatherData.current.wind_kph < 15) ? './images/slow.png' : (weatherData.current.wind_kph < 25) ? './images/moderate.png' : 
    (weatherData.current.wind_kph < 35) ? './images/High.png' : './images/veryHigh.png'; 
    windImage.alt = 'Wind';
    windDiv.appendChild(windImage);

    const windValue = document.createElement('h2');
    windValue.textContent = `${weatherData.current.wind_kph}Kph`; 
    windDiv.appendChild(windValue);

    windCountryDiv.appendChild(windDiv);
 
    windIndicatorSection.appendChild(windCountryDiv);
}

//Call addCountries in index.js