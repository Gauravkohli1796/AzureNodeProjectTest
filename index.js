const express = require('express')
const app = express();
app.use(express.json());
const config=require("./Constants/config");
const path=require("path");
const Port=process.env.PORT || config.Port;
 
app.get('/getTest', function (req, res) {
  res.send('Hello World from Azure Test')
});


app.get('/getAzureStorageImage', function (req, res) {
    res.sendFile(path.join(__dirname+"/./HTML/index.html"));
  });


app.post('/postTest', function (req, res) {
    res.json(req.body);
  });


 
app.listen(Port,()=>{
    console.log(`server is listening on port ${Port}`)
}).on('error', function (err) {
    logger.info(`Error in hosting  :- ${err.message}`);
})