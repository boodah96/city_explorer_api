'use strict';

const express=  require('express');

require('dotenv').config();

const cors=require('cors');

const server= express();
 server.use(cors());

 const PORT=process.env.PORT ||3050;

 server.get('/rout',(req,res)=>{
     res.send('pass rout')
 })
 
server.get('/location',(req,res)=>{
    const locData= require('./data/location.json')
    const location=new Location(locData);
    res.send(location)
})

server.get('/weather',(req,res)=>{
    const wetherFile=require('./data/weather.json');
    const weathData=wetherFile.data;
    let weather= weathData.map((element)=>{
        const todayWeather= new Weather(element);
        return todayWeather;

    });
    console.log(weather);
   
    res.send(weather);
})

server.get('*',(req,res)=>{
    const err=  {
        status: 500,
        responseText: "Sorry, something went wrong"
      }
    res.send(err);
})



function Weather(obj){
    this.forecast=obj.weather.description;
    this.time=obj.datetime;
}

function Location(locPage){
    this.search_query='Lynnwood';
    this.formatted_query=locPage[0].display_name;
   this.latitude=locPage[0].lat;
  this.longitude=locPage[0].lon;
}



server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`)
})
