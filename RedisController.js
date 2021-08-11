const Redis = require("ioredis");
//const AzureKeyVaultHandler=require("./AzureKeyVaultHandler");
//var CAzureKeyVaultHandler = new AzureKeyVaultHandler().getInstance();
const config=require("./Constants/config");

 /*var redis = new Redis({
        port: parseInt(CAzureKeyVaultHandler.ConfigJson.RedisPort),   // Redis port
        host: CAzureKeyVaultHandler.ConfigJson.RedisHost, // Redis host
        password: CAzureKeyVaultHandler.ConfigJson.RedisPassword
 });*/
var redis = new Redis(config.RedisConnectionParams);

redis.on('error', function (er) {
    console.error(er.stack); 
  });

let InsertorFindInRedisCache=function(req,res,next)
{
        if(!(req.query.collectionName && req.query.EmpName))
        {
            res.json({ResMsg:"Invalid request parameters"});
            return;
        }
        let Searchkey=req.query.collectionName+"/"+req.query.EmpName;
        redis.get(Searchkey, function (err, result) {
            if (err) {
                res.send(err);
                return;
            } 
            else if(result)
            {
                let JsonReponse=JSON.parse(result);
                JsonReponse['ResponeFrom']="Azure Redis Cache";
                res.send(JsonReponse);
                return;
            } 
            else
            {
              //data is not found in redis so going to fetch from mongodb and there we will save data in redis also.
                next();
            }
        }) 
 

}



module.exports={
    InsertorFindInRedisCache:InsertorFindInRedisCache,
    redis:redis

}


