
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const opn = require("opn")

 app.set('view engine', 'ejs');

const API_KEY = '877d67fce9c770c570b0bb439d5faad3'


app.use(bodyParser.urlencoded({ extended: false }));


app.get("/" , (req , res) => {
  res.sendFile('intro.html', { root: __dirname })
})

app.get('/forecast.html', function(req,res) {
  res.sendFile('forecast.html', { root: __dirname })
})


app.get('/weather.html', function(req,res) {
  res.sendFile('weather.html', { root: __dirname })
})

app.get('/pollution.html', function(req,res) {
  res.sendFile('pollution.html', { root: __dirname })
})



app.get('/get_forecast', (req, res) => {


    let city = req.query.city
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
  request(url, (err, response, body) => {
    if (err) {
      res.render("error" , {
        error: "error , please try again"
      })
    } else {
      const data = JSON.parse(body);
      res.render('forecast', {
        city: data.city.name,
        forecast: data.list.slice(0, 5),
      });
    }
  });
});


app.get("/weather" , (req , res) => {
  let city = req.query.city
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  request(url , (err , response , body) =>{
    if(!err && response.statusCode == 200){
      const weatherData = JSON.parse(body)
      res.render("weather" , {
        city: weatherData.name,
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        feels_like:weatherData.main.feels_like
      })
    }else
    res.status(500).json({ error: 'Error getting current weather data' });
  })
})


app.get("/air-pollution" , ( req , res) => {
  let lat = req.query.lat
  let lon = req.query.lon
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  request(url , (err , response , body) => {
    if(!err && response.statusCode == 200){

      const poll = JSON.parse(body)

      console.log(poll.list[0].components)
       res.render('pollution', {
        pollution: poll.list[0].components ,
        quality:poll.list[0].main
      })
    }else {
      res.status(500).json({ error: 'Error getting pollution data' });
    }
  })
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');

  opn('http://localhost:3000').catch((err) => {
    console.error(`Failed to open the URL in the default browser: ${err.message}`);
  });

});

