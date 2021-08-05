var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EMPLOYEE_COLLECTION = new Schema({
  EmpName: {
    type: String,
    required: true,
    unique:true
  },
  EmpAge: {
    type: Number,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  IsPermanent:{
    type: Boolean,
    required: true,
  },
  
  JoiningDate: {
    type: Date,
    default:Date.now
  }
});

module.exports = mongoose.model(
  "EMPLOYEE_COLLECTION",
   EMPLOYEE_COLLECTION
);