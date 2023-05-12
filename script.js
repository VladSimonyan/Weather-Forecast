const DateTime = luxon.DateTime;
var now = DateTime.now();
const apiKey = "9829a4855c0d59b42e6f434613c07c77";
var lat;
var lon;
var cityName = "Ottawa";
var currCon;
var currTemp;
var currWind;
var currHum;
var currUv = "";
var tempArr = [];
var cityArr = [];
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiOneCall = "https://api.openweathermap.org/data/2.5/onecall?units=metric";


function getWeather() {
  clearContents();
 
  fetch(apiUrl + cityName + "&units=metric&appid=" + apiKey).then(function (
    response
  ) {
    if (response.ok) {
      response.json().then(function (data) {
        cityName = data.name;
        lat = data.coord.lat;
        lon = data.coord.lon;
        currCon = data.weather[0].main;
        currTemp = data.main.temp;
        currWind = data.wind.speed;
        currHum = data.main.humidity;
       a
        fetch(
          apiOneCall + "&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey
        ).then(function (oneCallResponse) {
          if (oneCallResponse.ok) {
            oneCallResponse.json().then(function (oneCallData) {
              currUv = oneCallData.current.uvi;
              tempArr = oneCallData.daily;
              displayWeather();
              saveHistory();
              populateHistory();
            });
          } else {
            alert("Something went wrong");
          }
        });
      });
    } else {
      alert("Choose a valid city");
    }
  });
}


function displayWeather() {
  
  var cityText = $("<div>");
  var conIcon = $("<i>");
  var cityRow = $("<div>");
  var tempText = $("<div>");
  var windText = $("<div>");
  var humText = $("<div>");
  var uvLabel = $("<div>");
  var uvText = $("<div>");
  var uvRow = $("<div>");

  cityText.addClass("city-name font-bold text-lg");
  conIcon.addClass("mt-1 ml-2");
  tempText.addClass("weather-info");
  windText.addClass("weather-info");
  humText.addClass("weather-info");
  uvText.addClass("weather-info");
  uvLabel.addClass("weather-info mr-2");
  uvRow.addClass("uv-row flex flex-row");
  cityRow.addClass("city-row flex flex-row");
  
  conIcon.addClass(iconClass(currCon));

  
  if (currUv < 3) {
    uvText.addClass("bg-green-200 rounded-full");
  } else if (currUv > 2 && currUv < 6) {
    uvText.addClass("bg-yellow-200 rounded-full");
  } else if (currUv > 5 && currUv < 8) {
    uvText.addClass("bg-red-200 rounded-full");
  } else if (currUv > 7) {
    uvText.addClass("bg-red-400 rounded-full");
  }

  
  cityText.text(cityName + "(" + now.toLocaleString(DateTime.DATE_SHORT) + ")");
  tempText.text("Temp: " + currTemp + " C");
  windText.text("Wind: " + currWind + " KPH");
  humText.text("Humidity: " + currHum + "%");
  uvText.text(currUv);
  uvLabel.text("UV Index:");
  cityRow.append(cityText);
  cityRow.append(conIcon);
  $(".weather").append(cityRow);
  $(".weather").append(tempText);
  $(".weather").append(windText);
  $(".weather").append(humText);
  uvRow.append(uvLabel);
  uvRow.append(uvText);
  $(".weather").append(uvRow);

 
  for (i = 1; i < 6; i++) {
    var d = now.plus({ days: i }).toLocaleString(DateTime.DATE_SHORT);
    var dayClass = ".day" + i;
    var dayDailyText = $("<div>");
    var dailyIcon = $("<i>");
    var tempDailyText = $("<div>");
    var windDailyText = $("<div>");
    var humDailyText = $("<div>");
    dayDailyText.addClass("daily-weather font-bold");
    tempDailyText.addClass("daily-weather");
    windDailyText.addClass("daily-weather");
    humDailyText.addClass("daily-weather");
    dailyIcon.addClass(iconClass(tempArr[i].weather[0].main));
    dayDailyText.text(d);
    tempDailyText.text("Temp: " + tempArr[i].temp.day + " C");
    windDailyText.text("Wind: " + tempArr[i].wind_speed + " KPH");
    humDailyText.text("Humidity: " + tempArr[i].humidity + "%");
    $(dayClass).append(dayDailyText);
    $(dayClass).append(dailyIcon);
    $(dayClass).append(tempDailyText);
    $(dayClass).append(windDailyText);
    $(dayClass).append(humDailyText);
  }
}


function populateHistory() {
  cityArr = JSON.parse(localStorage.getItem("savedCities"));
  if (!cityArr) {
    cityArr = [];
  }
  $(".city-history").empty();
  //For each city in the array, create a button and append it to the page
  for (i = 0; i < cityArr.length; i++) {
    var cityHist = $("<button>");
    cityHist.addClass(
      "cityBtn mt-3 bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-10 rounded-full"
    );
    cityHist.attr("id", cityArr[i]);
    cityHist.text(cityArr[i]);
    $(".city-history").append(cityHist);
  }
}


function clearContents() {
  $(".weather").empty();
  for (i = 1; i < 6; i++) {
    var dayClass = ".day" + i;
    $(dayClass).empty();
  }
}


function saveHistory() {
  if (!cityArr.includes(cityName)) {
    cityArr.unshift(cityName);
  }
  //Limit the list of cities to 10 by popping the oldest city
  if (cityArr.length > 10) {
    cityArr.pop();
  }
  localStorage.setItem("savedCities", JSON.stringify(cityArr));
}


function iconClass(condition) {
  if (condition == "Clouds") {
    return "wi wi-cloudy";
  } else if (condition == "Clear") {
    return "wi wi-day-sunny";
  } else if (condition == "Haze") {
    return "wi wi-smog";
  } else if (condition == "Rain") {
    return "wi wi-rain";
  }
}


$(".container").on("click", "#submitcity", function () {
  cityName = $("#cityinput").val().trim();
  $("#cityinput").val("");
  getWeather();
});


$("#cityinput").keypress(function (e) {
  if (e.which == 13) {
    cityName = $("#cityinput").val().trim();
    $("#cityinput").val("");
    getWeather();
  }
});


$(".container").on("click", ".cityBtn", function () {
  cityName = $(this).attr("id");
  getWeather();
});


populateHistory();
getWeather();
