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

function Location(locPage){
    this.search_query='Lynnwood';
    this.formatted_query=locPage[0].display_name;
   this.latitude=locPage[0].lat;
  this.longitude=locPage[0].lon;
}



server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`)
})
