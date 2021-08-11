module.exports =Object.freeze({
     Port:4000,
     AzureConnectionString:'DefaultEndpointsProtocol=https;AccountName=nodeazurestorageaccount;AccountKey=0y6IocFcucvLXDFEU4whGROcMO9q7kj8qASnyGfRy6Fx0l+WDpoJXB5jNWumZnhCJY8sqBJk07mVr52CN+WrQw==;EndpointSuffix=core.windows.net',
     AzureContainerName:"nodeazureblobcontainer",
     MongoUrl:"mongodb://nodeazuremongodb:g7RO2nzTF5A5tRo4z6WJl9tP8Z4RB85GH8JtzBGS3qWZsfrs1sjMocp8P22Z21WWqtYQKAZXpvVadZY17yyXfg==@nodeazuremongodb.mongo.cosmos.azure.com:10255/AzureTestDB?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@nodeazuremongodb@",
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
       RedisConnectionParams:
        {
        port: 6379, // Redis port
        host: "NodeAzureRedisCache.redis.cache.windows.net", // Redis host
        password: "vZuP5s0aer4byYBdiIHfsVSzYTM7SJ+o6Gm7hsW5HVs="
        }
});