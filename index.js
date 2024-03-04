const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");

const userContainer= document.querySelector(".weather-container");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");

const loadingScreen= document.querySelector(".loading-container");

const userInfoContainer= document.querySelector(".user-info-container");
const errorContainer=document.querySelector(".error-container") 
const errorText=document.querySelector("[data-errorText]");

let currentTab= userTab;
const API_KEY= "bbbd5880908efa0d00c8354ed00e9871";

getFromSessionStorage();

currentTab.classList.add("current-tab");

function switchTab(clickedTab){
    errorContainer.classList.remove("active");
    if (clickedTab !== currentTab){
        currentTab.classList.remove("current-tab");
        currentTab= clickedTab;
        clickedTab.classList.add("current-tab"); 
    
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromSessionStorage();
    }
}
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});


function getFromSessionStorage(){
   const localCoodinates= sessionStorage.getItem("user-coordinates");
//    console.log(localCoodinates);
   if(!localCoodinates){
         grantAccessContainer.classList.add("active");

   }
   else{
    const coordinates= JSON.parse(localCoodinates);
    fetchUserWeatherInfo(coordinates);
}
}

async function fetchUserWeatherInfo(coordinates){
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    

    try{
        const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`);
        const data= await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        rendorWeatherInfo(data);
        // console.log(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        errorText.innerText= "City not found";
        
    }
}

function rendorWeatherInfo(weatherInfo){
    const cityName= document.querySelector("[data-cityName]");
    console.log(cityName);
    const countryIcon= document.querySelector("[data-countryName]");
    const desc= document.querySelector("[data-weatherDesc]"); 
    const weatherIcon= document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness= document.querySelector("[data-cloudiness]");

    cityName.innerText= weatherInfo?.name;
    // console.log(weatherInfo?.name);
    // console.log(document.querySelectorAll("[data-cityName]"));
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src= `http://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText= `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText= `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText= `${weatherInfo?.clouds?.all}%`;
}
const grantAccessButton= document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation); 

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Your browser does not support geolocation");
    }
}

function showPosition(position){
    const userCoordinates= {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

let searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(searchInput.value===""){
        return;
    }
    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");  
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");

    try{
        const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await res.json();

        if (!data.sys) {
            throw data;
        }
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        rendorWeatherInfo(data);
    }
    catch(error){
        // console.log(err);
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        errorText.innerText= "City not found";
        
    }

}

