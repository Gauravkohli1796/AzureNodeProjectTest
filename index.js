const express = require('express')
const app = express();
app.use(express.json());
const config=require("./Constants/config");
const path=require("path");
const Port=process.env.PORT || config.Port;
const { BlobServiceClient } = require("@azure/storage-blob");
var ip = require("ip");
const MongoRoute=require("./routes/MongoRoute");
const RedisRoute=require("./routes/RedisRoute");
const MongoDbConn=require("./DataBase/MongoDbConn");


const connStr =config.AzureConnectionString;

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(config.AzureContainerName);




// app.get('/getTest', function (req, res) {
//   res.send(`Hello World from Azure Test from instance ip github test ${ip.address()}`);
// });
 
// app.get('/getTextFromAzureStorage', async function (req, res) {

//  try
//  { 
//     const blockBlobClient = containerClient.getBlockBlobClient(req.query.FileName);
//     const downloadBlockBlobResponse = await blockBlobClient.download(0);
//     const fileContent=await streamToString(downloadBlockBlobResponse.readableStreamBody);
//     res.send(fileContent);
//  }
//  catch(err)
//  {
//     res.send(err.message);
//  }
// });


// app.post('/createAzureStorageFile', async function (req, res) {

//   try
//   { 
//     if(!(req.body.FileConent && req.body.FileName))
//     {
//       res.send("FileConent and FileName is required in request body");
//       return;

//     }
//     const content = req.body.FileConent.toString() || "";
//     const blobName = req.body.FileName.toString();
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
//     console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
//     res.send(`Succesfully created blog storage with filename as ${blobName}`);
//   }
//   catch(err)
//   {
//      res.send(err.message);
//   }
//  });


// app.get('/getAzureStorageImage', function (req, res) {
//     res.sendFile(path.join(__dirname+"/./HTML/index.html"));
//   });


// app.post('/postTest', function (req, res) {
//     res.json(req.body);
//   });


 
// app.listen(Port,()=>{
//     console.log(`server is listening on port ${Port}`)
// }).on('error', function (err) {
//     logger.info(`Error in hosting  :- ${err.message}`);
// });



async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}






async function AppStart() {
      var CMongoDbConn = new MongoDbConn(config.MongoDB).getInstance();

      try {
        //connect to mongo instance
        await CMongoDbConn.ConnectDb();
      } catch (err) {
        logger.info("Error while Connecting Mongo DB" + err.message);
      }

      //Destroy Mongoose connection on process exit by ctrl+c
      process.on("SIGINT", function () {
        CMongoDbConn.DisconnectDb();
      });

      app.use("/Mongo",MongoRoute);
      app.use("/Redis",RedisRoute);
    


      app.get('/getTest', function (req, res) {
        res.send(`Hello World from Azure Test from instance ip github test ${ip.address()}`);
      });
      
      app.get('/getTextFromAzureStorage', async function (req, res) {
      
      try
      { 
          const blockBlobClient = containerClient.getBlockBlobClient(req.query.FileName);
          const downloadBlockBlobResponse = await blockBlobClient.download(0);
          const fileContent=await streamToString(downloadBlockBlobResponse.readableStreamBody);
          res.send(fileContent);
      }
      catch(err)
      {
          res.send(err.message);
      }
      });
      
      
      app.post('/createAzureStorageFile', async function (req, res) {
      
        try
        { 
          if(!(req.body.FileConent && req.body.FileName))
          {
            res.send("FileConent and FileName is required in request body");
            return;
      
          }
          const content = req.body.FileConent.toString() || "";
          const blobName = req.body.FileName.toString();
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
          const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
          console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
          res.send(`Succesfully created blog storage with filename as ${blobName}`);
        }
        catch(err)
        {
          res.send(err.message);
        }
      });

      //To handle any type of request which is not handled by any above routes
      app.use("*",function(req,res)
      {
          res.send("This request is not handled by any route");
      });

      //To handle any error in route which is not handled by route itself
      app.use(function (err, req, res, next) {
          console.log(err && err.message);
          res.send(err);
      });

      app.listen(Port,()=>{
        console.log(`server is listening on port ${Port}`)
        }).on('error', function (err) {
          logger.info(`Error in hosting  :- ${err.message}`);
    });

}

AppStart();