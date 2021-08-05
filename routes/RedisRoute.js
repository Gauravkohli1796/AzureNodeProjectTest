const express = require("express");
const router = express.Router();
router.use(express.json());
const Employee=require("../models/Employee");
let {InsertorFindInRedisCache,redis}=require("../RedisController");

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