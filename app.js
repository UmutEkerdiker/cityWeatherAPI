require("dotenv").config();
const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {
    console.log("Status code for this request is " + response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      res.write("<p>The weather is currently " + weatherDescription + ".</p>");
      res.write("<h1> The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<img src=" + imgURL + ">");
      res.send();
    });
  });
});





app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
