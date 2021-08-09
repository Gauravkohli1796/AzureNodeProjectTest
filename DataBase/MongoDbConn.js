//var config = require("../Constants/config");
var mongoose = require("mongoose");
class MongoDbConn {
  constructor(strMongoUrl) {
    this.MongoUrl = strMongoUrl;
    this.connect = undefined;
  }
}
MongoDbConn.prototype.ConnectDb = async function () {
  const ConnectionString = this.MongoUrl;
  try {
    this.connect = await mongoose.connect(ConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.log(err.message);
    console.log("Exiting process as MongoDB connection Fails");
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }
};

MongoDbConn.prototype.DisconnectDb = function () {
  mongoose.connection.close(function () {
    console.log("Mongoose connection disconnected on process exit");
    process.exit(0);
  });
};

class Singleton {
  constructor(strMongoUrl) {
    if (!Singleton.instance) {
      Singleton.instance = new MongoDbConn(strMongoUrl);
    }
  }
  getInstance() {
    return Singleton.instance;
  }
}
module.exports = Singleton;