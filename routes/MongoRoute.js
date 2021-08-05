const express = require("express");
const router = express.Router();
router.use(express.json());
const Employee=require("../models/Employee");

router.get("/getMongoData",async function(req,res)
{
    try
    {
       let Seachkey=req.query.EmpName;
       let DbData=await Employee.findOne({EmpName:Seachkey});
       if(!DbData)
       {
        res.json({ResMsg:`No data found for Empname=${Seachkey}`});
        return;
       }
       res.send(DbData);

    }
    catch(err)
    {
        res.send(err.message);
    }

});



router.post("/InsertRecordInMongoDb",async function(req,res)
{
    try
    {
      if(!(req.body.EmpName && req.body.EmpAge && req.body.Gender && req.body.IsPermanent))
      {
       res.json({ResMsg:"Invalid parameter request"});
       return
      }
      let tmpDBData={};
      tmpDBData["EmpName"]=req.body.EmpName;
      tmpDBData["EmpAge"]=req.body.EmpAge;
      tmpDBData["Gender"]=req.body.Gender;
      tmpDBData["IsPermanent"]=req.body.IsPermanent;

      let ObjEmployee=new Employee(tmpDBData);
      let DbData= await ObjEmployee.save();
      res.send(DbData);

    }
    catch(err)
    {
        res.send(err);
    }

});



module.exports=router;