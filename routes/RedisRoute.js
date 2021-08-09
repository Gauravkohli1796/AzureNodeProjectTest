const express = require("express");
const router = express.Router();
router.use(express.json());
const Employee=require("../models/Employee");
let {InsertorFindInRedisCache,redis}=require("../RedisController");

/**
 * tags:
 *     name: Redis Cache,
 *     description: All apis corresponding to redis cache.
 */

/**
 * @swagger
 * /Redis/getDataFromRedis:
 *   get:
 *     tags: [Redis Cache]
 *     summary: This api is used to fetch employee details corresponding to empname passed as query params in get request from redis cache.if data is not found in cache it will fetch data from db and set it to redis cache.
 *     parameters:
 *       - in: query
 *         name: EmpName
 *         type: string
 *         description: EmpName to be passed for fetching its corresponding details from DB.
 *         required: true
 *       - in: query
 *         name: collectionName
 *         type: string
 *         description: collectionname to be used to fetch employee details.
 *         required: true
 *     responses:
 *       200:
 *         description: get the employee details as a result.
 */



router.get("/getDataFromRedis",InsertorFindInRedisCache,async function(req,res)
{
    try
    {
        let Searchkey=req.query.collectionName+"/"+req.query.EmpName;
        let DbData=await Employee.findOne({EmpName:req.query.EmpName}).lean();
        if(DbData)
        {
            await redis.set(Searchkey,JSON.stringify(DbData)); 
            DbData["ResponeFrom"]="Azure MongoDB";
            res.send(DbData);
            return;
        }
        else
        {
           res.json({ResMsg:`No information is found for Empname- ${req.query.EmpName} in Azure MongoDB or Azure RedisCache`});
           return;
        }
    }

    catch(err)
    {
            res.send(err);
            return;
    }
})

module.exports=router;