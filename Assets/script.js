$(document).ready(function () {

        // Weather Api Key for open weather map
        const weatherapiKey = '4b8f39756230ef6ddea7bbd640a4db05';
    
        // Event Listener for click for Search Button
        $("#searchWeather").on("click", function (e) {
            e.preventDefault();
            findWeather();
        });
    
        //Clear Local Storage on refresh 
        localStorage.clear();
    
        var cityEntered;
    
        //FUnction that gets weather forecast for enetered city
        function findWeather() {
            cityEntered = $("#enterCity").val();
    
            //Api call to get lat long
            var locationApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityEntered + "&units=imperial&appid=" + weatherapiKey;
            fetch(locationApiUrl).then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        $("#city-list").append('<button type="button" class=" cityName">' + cityEntered);
                        let lat = data.coord.lat;
                        let lon = data.coord.lon;
                        var latLonPairToStore = lat.toString() + " " + lon.toString();
                        localStorage.setItem(cityEntered, latLonPairToStore);
    
                        // Api call to get weather data for the city with lat long
                        apiURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherapiKey;
                        fetch(apiURL).then(function (weatherResponse) {
                            if (weatherResponse.ok) {
                                weatherResponse.json().then(function (weatherData) {
                                    clearFields();
                                    displayWeatherData(weatherData.list[0]);
                                    displayFiveDaysData(weatherData);
                                    checkDuplicates();
                                })
                            }
                        })
                    })
                } else {
                    //Error msg if city name is not available 
                    alert("City Name Not Found!");
                }
            })
        }
    
    
        //Function that hets data of city from search history
        function getSelectedCityWeather(cord) {
            // Api call to get weather data for the city with lat long
            apiURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cord[0] + "&lon=" + cord[1] + "&appid=" + weatherapiKey;
            fetch(apiURL).then(function (weatherResponse) {
                if (weatherResponse.ok) {
                    weatherResponse.json().then(function (weatherData) {
                        clearFields();
                        displayWeatherData(weatherData.list[0]);
                        displayFiveDaysData(weatherData);
                    })
                }
            })
    
        }
    
    
        //Function added to remove any duplciates inside search history list
        function checkDuplicates() {
            var textInsideLi = '';
            var butList = $('#city-list button');
            var remList = [];
            $(butList).each(function () {
                var text = $(this).text();
                if (textInsideLi.indexOf('|' + text + '|') == -1)
                    textInsideLi += '|' + text + '|';
                else
                    remList.push($(this));
            });
            $(remList).each(function () {
                $(this).remove();
            });
        }
    
    
        // Emptying all UI fields before searching
        function clearFields() {
            $('#enterCity').val('');
            $('#currentCityName').empty();
            $("#currentIcon").empty();
            $("#temp").empty();
            $("#windSpeed").empty();
            $("#humidity").empty();
            for (let i = 0; i < 5; i++) {
                $("#weatherDay-" + i).empty();
                $("#imgicon-" + i).empty();
                $("#temperature-" + i).empty();
                $("#windspeed-" + i).empty();
                $("#humidity-" + i).empty();
    
            }
        }
    
    
        //Function that helps in displaying five days data
        function displayFiveDaysData(data) {
            $("#futureSection").addClass("show").removeClass("hide");
            for (let i = 0; i < 5; i++) {
                //We get data for every three hours, hence this code is added to loop through response after every eight elements in response array
                toDisplay = ((i + 1) * 8) - 1;
                $("#weatherDay-" + i).append(moment.unix(data.list[toDisplay].dt).format('M/D/YYYY'));
                $("#imgicon-" + i).attr("src", "http://openweathermap.org/img/wn/" + data.list[toDisplay].weather[0].icon + "@2x.png");
                $("#temperature-" + i).append("Temp: " + kelToFareConverter(data.list[toDisplay].main.temp) + " \u2109");
                $("#windspeed-" + i).append("Wind: " + data.list[toDisplay].wind.speed + " MPH");
                $("#humidity-" + i).append("Humidity: " + data.list[toDisplay].main.humidity + "% ");
    
            }
        }
    
    
        //Function that displays data of selected city for current date
        function displayWeatherData(data) {
            $("#currentCityName").append(cityEntered + " (" + moment().format('M/D/YYYY') + ")");
            $("#viewCityWeatherDiv").addClass("show").removeClass("hide");
            $("#currentIcon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
            $("#temp").append("Temp: " + kelToFareConverter(data.main.temp) + " \u2109");
            $("#windSpeed").append("Wind: " + data.wind.speed + " MPH");
            $("#humidity").append("Humidity: " + data.main.humidity + "% ");
        }
    
        //Response of temp is coming in Kelvin. This function is written to convert to Kel to faren
        function kelToFareConverter(deg) {
            return ((deg - 273.15) * 9 / 5 + 32).toFixed(1);
        }
    
        // Event Listener added to search from history which was stored in local storage
        $(".cityList").on("click", ".cityName", function () {
            var coord = (localStorage.getItem($(this)[0].textContent)).split(" ");
            coord[0] = parseFloat(coord[0]);
            coord[1] = parseFloat(coord[1]);
            cityEntered = $(this)[0].textContent;
            getSelectedCityWeather(coord);
        })
    
    });