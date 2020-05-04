const express = require('express')
const app = express()
const params = require('./params.json')
const bodyParser = require('body-parser')
const request = require('request')


let apiKey = '46d456f8f76c25c05b278e1fb5df47bf';

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index')
})

app.listen(params.portnumber, function () {
    console.log('Example app listening on port ' + params.portnumber.toString() + '!')
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    request(url, function (err, response, body) {
        if (err) {
            res.render('index', { weather: null, error: 'Servise ulaşılamadı. Tekrar deneyin.' });
        } else {
            let weather = JSON.parse(body)
            let sunset = weather.sys.sunset * 1000;
            // console.log(weather);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Şehir bulunamadı. Tekrar deneyin.' });
            } else {
                res.render('index', {
                    weather: processSunsetText(weather),
                    error: null
                })
                /*
                let weatherText = weather.name + ' için sıcaklık ' + tempString(weather.main.temp) + 'ºC';
                //`${weather.name} için sıcaklık ${weather.main.temp}ºC.`;
                res.render('index', { weather: weatherText, error: null });
                */
            }
        }
    });
})

function processSunsetText(weather) {
    let curr = Date.now();
    let sunset = weather.sys.sunset * 1000;
    let time = (curr - sunset) / 1000;
    console.log("current " + new Date(curr).toString());
    console.log("sunset " + new Date(sunset).toString());

    if (time > 0) {
        // then we are past iftar
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time - minutes * 60);
        var hours = Math.floor(time / 3600);
        minutes = minutes - 60 * hours;
        var str = weather.name + " şehri iftar saatini ";
        if (hours != 0)
            str += hours.toString() + " saat ";
        if (minutes != 0)
            str += minutes.toString() + " dakika "
        str += seconds.toString() + " saniye geçmiş. "
        str += "Allah kabul etsin.";
    } else {
        time = -time;
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time - minutes * 60);
        var hours = Math.floor(time / 3600);
        minutes = minutes - 60 * hours;
        var str = weather.name + " şehrinde iftara ";
        if (hours != 0)
            str += hours.toString() + " saat ";
        if (minutes != 0)
            str += minutes.toString() + " dakika "
        str += seconds.toString() + " saniye var. "
        str += "Allah kudret versin.";
    }
    return str;
}
/*

  request(url, function (err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      let weather = JSON.parse(body)
      let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
      console.log(message);
    }
  });
  */