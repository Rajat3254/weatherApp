const myWeather=document.querySelector('.YourW');
const searchWeather=document.querySelector('.SearchW');
const search_container=document.querySelector('.searchContainer');
const grantWeather_container=document.querySelector('.grantLocation');
const searchBtn=document.querySelector('.search_btn');
const city=document.querySelector('.searchContent');
const errorScreen=document.querySelector('.error');
const seacrhedWetherInfo=document.querySelector('.weatherInfo'); 
const loadingScreen=document.querySelector('.load');
const grant=document.querySelector('.grantAccess'); 
let currTab=myWeather;
const API_key='99a1e39dd299493c26846eece901e570';
let data;
//getFromSessionStorage();
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
        }else{
            search_container.classList.remove('flex');
            search_container.classList.add('hidden');
            // grantWeather_container.classList.add('flex');
            // grantWeather_container.classList.remove('hidden');
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
        seacrhedWetherInfo.classList.add('hidden');
        seacrhedWetherInfo.classList.remove('flex'); 
    }else{
        grantWeather_container.classList.remove('flex');
        grantWeather_container.classList.add('hidden');
        const place=JSON.parse(localCoordinates);
        fetchInfo(place);
        seacrhedWetherInfo.classList.add('hidden');
        seacrhedWetherInfo.classList.remove('flex'); 
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
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('flex');
    try{
     const info=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
     console.log('fetched');
     data=await info.json();
     loadingScreen.classList.add('hidden');
     loadingScreen.classList.remove('flex');
     renderInfo(data);
    }catch{

    }
 }
 async function renderInfo(data){
    let cityName=document.querySelector('.city_name');
    let flag=document.querySelector('.flag_img');
    let weatherCondition=document.querySelector('.Weather_condition');
    let conditionImg=document.querySelector('.Condition_img');
    let temperature=document.querySelector('.tempreture');
    let windSpeed=document.querySelector('.speed');
    let humidity=document.querySelector('.humidity');
    let clouds=document.querySelector('.cloud');
    cityName.innerText = data?.name;
    flag.src=`https://flagcdn.com/144x108/${data?.sys?.country?.toLowerCase()}.png`;
    weatherCondition.innerText=data?.weather?.[0]?.description;
    conditionImg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText=data?.main?.temp;
    windSpeed.innerText=data?.wind?.speed;
    humidity.innerText=data?.main?.humidity;
    clouds.innerText=data?.clouds?.all;

 }
 searchBtn.addEventListener('click',()=>{
    
 });
 grant.addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showplace);
    }else{
        
    }

 });
 
 function showplace(position){
    let city=?;
    sessionStorage.setItem("user",JSON.stringify(city));
    fetchInfo(city);
 }
