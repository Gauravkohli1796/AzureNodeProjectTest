const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const credential = new DefaultAzureCredential();
const vaultName = "NodeAzureKeyValut";
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

class AzureKeyValutHandler {
  constructor() {
    this.ConfigJson ={};
  }
};

AzureKeyValutHandler.prototype.FindAllKeys = async function () {
   for await (let secretProperties of client.listPropertiesOfSecrets()) {
    this.ConfigJson[secretProperties.name]="";
  }
};

AzureKeyValutHandler.prototype.GetAllConfigParams =async function () {
   let KeysArray=Object.keys(this.ConfigJson);
   for(let i=0;i<KeysArray.length;i++)
   {
    let tempValue=await client.getSecret(KeysArray[i]);
    this.ConfigJson[KeysArray[i]]=tempValue.value;
   };
};

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new AzureKeyValutHandler();
    }
  }
  getInstance() {
    return Singleton.instance;
  }
};

module.exports = Singleton;
  

