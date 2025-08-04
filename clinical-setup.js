import 'dotenv/config';
// rodar no node v22
import { createConnection, Schema } from "mongoose";


const con = createConnection(process.env.MONGO_URL, {
  dbName: process.env.CLINICAL_DB_NAME
});

const unitSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  unitTypeId: {
    type: String,
    required: true,
    enum: [
      "workplace", 
      "internment",
      "laboratory",
      "imaging"
    ]
  },
  wing: String,
  nursing: String,
  bed: Number,
  userId: Schema.Types.ObjectId,
}, {
  collection: "phisical_unit",
  timestamps: true,
});


// models 
const unitModel = con.model("Unit", unitSchema);

const main = async ()=>{
  try{
    const data = await unitModel.findOne();
    
    if(!data){
      await unitModel.create({
      name: "central",
      unitTypeId: "workplace",
    });

      console.log("[+] clinical service configured!");
    }
    console.log("[*] master configured!");
  }catch(e){
    console.log("[-] failed setup database: ", e);
  }finally{
    process.exit();
  }
}

await main();