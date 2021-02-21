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
 
server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`)
})
