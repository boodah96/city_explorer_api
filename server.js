'use strict';

const express=  require('express');

require('dotenv').config();

const cors=require('cors');
const superagent= require('superagent');

const server= express();
 server.use(cors());

 const PORT=process.env.PORT ||3050;

 server.get('/rout',handleRout);

 server.get('/location',locationHandler);

 
 server.get('/weather',weatherHandler)

 server.get('*',errorHandler)

 
 
 //Function definition
 
 function handleRout(req,res){
        res.send('pass rout')
    };
    function locationHandler(req,res){
        const cityName=req.query.city;
        let key = process.env.LOCATION_KEY;
        let url= `https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`
        superagent.get(url)
        .then(data=>{
            
            const location=new Location(cityName,data.body[0]);

            res.send(location);

        })

      
    }
    
    
    function weatherHandler(req,res){
        const lat=req.query.latitude;
        const lon=req.query.longitude;


        let key =process.env.WEATHER_KEY;

        let url=`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`
        superagent.get(url)
        .then(element=>{

            const weathData=element.body.data;
            let weather= weathData.map((element)=>{
                const todayWeather= new Weather(element);
                return todayWeather;
                
            });      
            console.log(weather);   
               res.send(weather);

        })

     
        
        
    }
    
    function errorHandler (req,res){
        const err=  {
            status: 500,
            responseText: "Sorry, something went wrong"
        }
        res.send(err);
        
    }
    
    //Constuctors
    function Weather(obj){
        this.forecast=obj.weather.description;
        this.time= obj.datetime;
       }
       
       function Location(city,locPage){
           this.search_query=city;
           this.formatted_query=locPage.display_name;
           this.latitude=locPage.lat;
           this.longitude=locPage.lon;
       }
    
    server.listen(PORT,()=>{
        console.log(`listening on PORT ${PORT}`)
    })
    