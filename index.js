const express = require('express')
const app = express();
app.use(express.json());
const config=require("./Constants/config");
const { BlobServiceClient } = require("@azure/storage-blob");
var ip = require("ip");
const MongoDbConn=require("./DataBase/MongoDbConn");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const AzureKeyVaultHandler=require("./AzureKeyVaultHandler");
var CAzureKeyVaultHandler = new AzureKeyVaultHandler().getInstance();

 const openapiSpecification = swaggerJsdoc(config.SwaggerOptions);
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));





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
      await CAzureKeyVaultHandler.FindAllKeys();
      await CAzureKeyVaultHandler.GetAllConfigParams();
      const Port=process.env.PORT || parseInt(CAzureKeyVaultHandler.ConfigJson.Port);
      const MongoRoute=require("./routes/MongoRoute");
      const RedisRoute=require("./routes/RedisRoute");
      const blobServiceClient = BlobServiceClient.fromConnectionString(CAzureKeyVaultHandler.ConfigJson.AzureConnectionString);
      const containerClient = blobServiceClient.getContainerClient(CAzureKeyVaultHandler.ConfigJson.AzureContainerName);
      var CMongoDbConn = new MongoDbConn(CAzureKeyVaultHandler.ConfigJson.MongoUrl).getInstance();

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
    
/**
 * tags:
 *     name:  Health Check API,
 *     description: A normal get API to check health of service.
 */

/**
 * tags:
 *     name: Azure Storage Account API,
 *     description: All Api's corresponding to Azure storage account.
 */

/**
 * @swagger
 * /getTest:
 *   get:
 *     tags: [Health Check API]
 *     summary: This api is used to fetch employee details corresponding to empname passed as query params in get request.
 *     responses:
 *       200:
 *         description: get the hello world string with server ip.
 */
      app.get('/getTest', function (req, res) {
        res.send(`Hello World from Azure Test from instance ip github test ${ip.address()}`);
      });


      /**
 * @swagger
 * /getTextFromAzureStorage:
 *   get:
 *     tags: [Azure Storage Account API]
 *     summary: This api is used to read content from azure file.
 *     parameters:
 *       - in: query
 *         name: FileName
 *         type: string
 *         description: FileName from which we need to read data.
 *         required: true
 *     responses:
 *       200:
 *         description: get the content of file passed a query parameters.
 */
      
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


      /**
 * @swagger
 * /Mongo/InsertRecordInMongoDb:
 *   post:
 *     tags: [Azure Storage Account API]
 *     summary: This api is used to insert file along with content.
 *     parameters:
 *       - in: formData
 *         name: FileConent
 *         type: string
 *         description: Content of file.
 *         required: true
 *       - in : formData
 *         name: FileName
 *         type: integer
 *         description: Name of new file.
 *         required: true 
 *     responses:
 *       200:
 *         description: Insert new file along with its contents in azure storage space.
 */
      
      
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