'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');
const superagent = require('superagent');

const server = express();
server.use(cors());

const pg = require('pg');
// connect pgserver+express server
const client = new pg.Client(process.env.DATABASE_URL);



const PORT = process.env.PORT || 3050;

server.get('/rout', handleRout);

server.get('/location', locationHandler);


server.get('/weather', weatherHandler)

server.get('/people', (req, res) => {
    let SQL = `SELECT * FROM locations;`;
    client.query(SQL)
        .then(results => {
            res.send(results.rows);
        })
        .catch((error) => {
            res.send('pppppppppppp', error.message)
        })
})



// server.get('*', errorHandler)



//Function definition

function handleRout(req, res) {
    res.send('pass rout')
};



function locationHandler(req, res) {
    const cityName = req.query.city;
    let SQL = 'SELECT search_query FROM locations;';
    let sqlV = [];
    let allCity = [];

    client.query(SQL)
        .then(results => {
            console.log(results.rows);
            // res.send(results.rows);
            sqlV = results.rows;
            allCity = sqlV.map(element => {
                return element.search_query;
            });

            if (!allCity.includes(cityName)) {
                let key = process.env.LOCATION_KEY;
                let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`
                superagent.get(url)
                    .then(data => {

                        const location = new Location(cityName, data.body[0]);
                        let SQL = `INSERT INTO locations VALUES ($1,$2,$3,$4) RETURNING *;`;
                        let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];
                        client.query(SQL, safeValues)
                            .then((result) => {
                                res.send(result.rows);
                                // res.send('data has been inserted!!');
                            })




                            console.log('from API')

                        res.send(location);
                    });

            } else {
                let SQL = `SELECT * FROM locations WHERE search_query = '${cityName}';`;
                client.query(SQL)
                .then(result=>{
                    console.log('from dataBase')
                    res.send(result.rows[0]);
                    
                })


            }






        })


}


function weatherHandler(req, res) {
    const lat = req.query.latitude;
    const lon = req.query.longitude;


    let key = process.env.WEATHER_KEY;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`
    superagent.get(url)
        .then(element => {

            const weathData = element.body.data;
            let weather = weathData.map((element) => {
                const todayWeather = new Weather(element);
                return todayWeather;

            });
            res.send(weather);

        })




}

function errorHandler(req, res) {
    const err = {
        status: 500,
        responseText: "Sorry, something went wrong"
    }
    res.send(err);

}

//Constuctors
function Weather(obj) {
    this.forecast = obj.weather.description;
    this.time = obj.datetime;
}

function Location(city, locPage) {
    this.search_query = city;
    this.formatted_query = locPage.display_name;
    this.latitude = locPage.lat;
    this.longitude = locPage.lon;
}
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`)
        })
    });


