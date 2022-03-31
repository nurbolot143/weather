const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "3d1d6b9619dbbc96836b1983191a406b";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
  https.get(url, function (response) {
    console.log(response.statusCode);
    try {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = Math.round(weatherData.main.temp);
        const weatherDescription = weatherData.weather[0].description;
        const city = weatherData.name;
        const icon = weatherData.weather[0].icon;
        const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        res.render("index", {
          temp: temp,
          cityName: city,
          weatherDescription: weatherDescription,
        });
      });
    } catch (error) {
      res.render("index");
    }
  });
});

app.listen(port, () => {
  console.log("Server is started on port", port);
});
