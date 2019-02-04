const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname + '/src')));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.listen(8000,function(){
    console.log("localhost:8000");
});