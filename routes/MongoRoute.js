const express = require("express");
const router = express.Router();
router.use(express.json());
const Employee=require("../models/Employee");

/**
 * tags:
 *     name: Mongo DB,
 *     description: All apis corresponding to mongodb routes.
 */

/**
 * @swagger
 * /azurePoc/Mongo/getMongoData:
 *   get:
 *     tags: [Mongo DB]
 *     summary: This api is used to fetch employee details corresponding to empname passed as query params in get request.
 *     parameters:
 *       - in: query
 *         name: EmpName
 *         schema:
 *            type: string
 *            description: EmpName to be passed for fetching its corresponding details from DB.
 *            required: true
 *     responses:
 *       200:
 *         description: get the employee details as a result.
 */

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


/**
 * @swagger
 * /azurePoc/Mongo/InsertRecordInMongoDb:
 *   post:
 *     tags: [Mongo DB]
 *     summary: This api is used to insert new employee in db corresponding ro details passed in form data.
 *     parameters:
 *       - in: formData
 *         name: EmpName
 *         type: string
 *         description: EmpName of employee.
 *         required: true
 *       - in : formData
 *         name: EmpAge
 *         type: number
 *         description: Age of employee.
 *         required: true 
 *       - in : formData
 *         name: Gender
 *         type: string
 *         description: Gender of employee.
 *         required: true 
 *       - in : formData
 *         name: IsPermanent
 *         type: boolean
 *         description: permanent/temporary employee(true for permanent).
 *         required: true
 *     responses:
 *       200:
 *         description: get employee details from db if successfully inserted with db record.
 */

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