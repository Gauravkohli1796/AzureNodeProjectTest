module.exports =Object.freeze({
    // Port:4000,
    // AzureConnectionString:'DefaultEndpointsProtocol=https;AccountName=nodeazurestorageaccount;AccountKey=5u/+SNgfNNq1h+sWhiTwWm/Voa3OrT7iI7RiD0YS44TKlYhaZBh07EZGnqacD6ylaN5Iybz45YiWPY/khcVlDw==;EndpointSuffix=core.windows.net',
    // AzureContainerName:"nodeazureblobcontainer",
    // MongoUrl:"mongodb://nodeazuremongodb:4Tx264PqMlkQStqihdSQLXsQDhQ0SXC5shLGZ2QRd68I2QKBvBuplMDXlVsZLu8lRMWHlLdcCGpcfzBRhelxzQ%3D%3D@nodeazuremongodb.mongo.cosmos.azure.com:10255/AzureTestDB?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@nodeazuremongodb@",
    SwaggerOptions:{
        apis: [`${__dirname}/../routes/*.js`,`${__dirname}/../index.js`] ,
        definition:{
            openapi: '3.0.0',
            info: {
                title: 'Microsoft Azure POC',
                version: '1.0.0',
                description:"This documentation containing all api description used for microsoft azure POC.",
            },
            servers:[
            {
                url:"http://localhost:4000",
                description: "local server"
            },
            ]
        },
       },
    //    RedisConnectionParams:
    //     {
    //     port: 6379, // Redis port
    //     host: "NodeAzureRedisCache.redis.cache.windows.net", // Redis host
    //     password: "vZuP5s0aer4byYBdiIHfsVSzYTM7SJ+o6Gm7hsW5HVs="
    //     }
});