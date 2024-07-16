const myWeather=document.querySelector('.YourW');
const searchWeather=document.querySelector('.SearchW');
const search_container=document.querySelector('.searchContainer');
const grantWeather_container=document.querySelector('.grantLocation');
const searchBtn=document.querySelector('.search_btn');
let cityt=document.querySelector('.searchContent');
const errorScreen=document.querySelector('.error');
const seacrhedWetherInfo=document.querySelector('.weatherInfo'); 
const loadingScreen=document.querySelector('.load');
const grant=document.querySelector('.grantAccess'); 
let currTab=myWeather;
const API_key='99a1e39dd299493c26846eece901e570';
// let data;
getFromSessionStorage();
function swapTab(userTab){
    if(currTab!==userTab){
        currTab.classList.remove('bg-slate-200');
        currTab.classList.remove('bg-opacity-25');
        userTab.classList.add('bg-slate-200');
        userTab.classList.add('bg-opacity-25'); 
        currTab=userTab;
        if(!search_container.classList.contains('flex')){
            search_container.classList.remove('hidden');
            search_container.classList.add('flex');
            grantWeather_container.classList.remove('flex');
            grantWeather_container.classList.add('hidden');
            seacrhedWetherInfo.classList.remove('flex');
            seacrhedWetherInfo.classList.add('hidden');
            errorScreen.classList.add('hidden');
        }else{
            search_container.classList.remove('flex');
            search_container.classList.add('hidden');
            getFromSessionStorage();
        }
    }
}

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user");
    if(!localCoordinates){
        console.log('taer');
        grantWeather_container.classList.remove('hidden');
        grantWeather_container.classList.add('flex');
        search_container.classList.add('hidden');
        search_container.classList.remove('flex'); 
    }else{
        console.log('not');
        grantWeather_container.classList.remove('flex');
        grantWeather_container.classList.add('hidden');
        const place=JSON.parse(localCoordinates);
        fetchInfo(place);
        search_container.classList.add('hidden');
        search_container.classList.remove('flex'); 
    }

}
myWeather.addEventListener('click',()=>{
   swapTab(myWeather);
});
searchWeather.addEventListener('click',()=>{
    swapTab(searchWeather);
 });
 async function fetchInfo(place){
    let city=place;
    seacrhedWetherInfo.classList.add('hidden');
    seacrhedWetherInfo.classList.remove('flex');
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('flex');
    try{
     const info=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
     console.log('fetched');
    let data=await info.json();
    if (data.cod !== 200) { 
        throw new Error('City not found');
    }
    grantWeather_container.classList.remove('flex');
     grantWeather_container.classList.add('hidden');
     loadingScreen.classList.add('hidden');
     loadingScreen.classList.remove('flex');
    
     renderInfo(data);
     seacrhedWetherInfo.classList.add('flex');
     seacrhedWetherInfo.classList.remove('hidden');
    }catch{
        errorScreen.classList.remove('hidden');
         loadingScreen.classList.add('hidden');
    }
 }
 async function renderInfo(data){
    let cityName=document.querySelector('.city_name');
    let flag=document.querySelector('.flag_img');
    let weatherCondition=document.querySelector('.Weather_condition');
    let conditionImg=document.querySelector('.Condition_img');
    let temperature=document.querySelector('.temperature');
    let windSpeed=document.querySelector('.speed');
    let humidity=document.querySelector('.humidity');
    let clouds=document.querySelector('.cloud');
    cityName.innerText = data?.name;
    flag.src=`https://flagcdn.com/144x108/${data?.sys?.country?.toLowerCase()}.png`;
    weatherCondition.innerText=data?.weather?.[0]?.description;
    conditionImg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText= `${data?.main?.temp} °C`;
    windSpeed.innerText=`${data?.wind?.speed} km/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    clouds.innerText=`${data?.clouds?.all}%`;
    

 }
 searchBtn.addEventListener('click',()=>{
    const cityTofindWeather=cityt.value;
    console.log(cityTofindWeather);
    if(!cityTofindWeather){
        errorScreen.classList.remove('hidden');
        seacrhedWetherInfo.classList.add('hidden');
        seacrhedWetherInfo.classList.remove('flex');
    }else{
        errorScreen.classList.add('hidden');
        fetchInfo(cityTofindWeather);
    }
 });

 cityt.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!cityt.value.trim()) {
            errorScreen.classList.remove('hidden');
        } else {
            errorScreen.classList.add('hidden');
            fetchInfo(cityt.value.trim());
        }
    }
});

 grant.addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPlace);
    }else{
        
    }

 });

function showPlace(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Use a reverse geocoding API to convert coordinates to a city name
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
            const city = data.city;
            if (city) {
                sessionStorage.setItem("user", JSON.stringify(city));
                fetchInfo(city);
            } else {
                console.error('City not found in geolocation data');
            }
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
        });
}
