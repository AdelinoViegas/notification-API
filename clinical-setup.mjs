import 'dotenv/config';
// rodar no node v22
import { createConnection, Schema } from "mongoose";

const con = createConnection(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DB_NAME,
  family: process.env.NODE_ENV === "development" ? 4 : undefined,
  appName: "master-clinical-setup"
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
  userId: Schema.ObjectId,
}, {
  collection: "phisical_unit",
  timestamps: true,
});

const workplaceSchema = new Schema({
  userId: Schema.ObjectId,
  workplaceId: Schema.ObjectId,
  actor: Schema.ObjectId, 
}, {
  collection: 'user_workplace_access',
  timestamps: true,
});

// models 
const unitModel = con.model("Unit", unitSchema);
const workplaceModel = con.model("Workplace", workplaceSchema);

const main = async ()=>{
  try{
    const data = await unitModel.findOne();
    
    if(!data){
      const central = await unitModel.create({
        name: "Central",
        unitTypeId: "workplace",
      });
      
      await workplaceModel.create({ workplaceId: central._id });
      console.log("[+] database was configured successful!");
    }
    console.log("[*] database is configured!");
  }catch(e){
    console.error("[-] failed setup database: ", e);
    console.error("[*] Check the database connection and try again...");
  }finally{
    process.exit();
  }
}

await main();