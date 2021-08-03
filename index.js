const express = require('express')
const app = express();
app.use(express.json());
const config=require("./Constants/config");
const path=require("path");
const Port=process.env.PORT || config.Port;
const { BlobServiceClient } = require("@azure/storage-blob");

const connStr =config.AzureConnectionString;

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(config.AzureContainerName);




app.get('/getTest', function (req, res) {
  res.send('Hello World from Azure Test !!')
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
});



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