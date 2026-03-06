import { unitModel, workplaceModel } from "./model";

export default async function dbConfigure(){
  try{
    const data = await unitModel.findOne();
    
    if(!data){
      const central = await unitModel.create({
        name: "Central",
        unitTypeId: "workplace",
      });
      
      await workplaceModel.create({ workplaceId: central._id });
      console.log("[SUCCESS] database was configured successful!");
    }
    console.log("[INFO] database is configured!");
  }catch(e){
    console.error("[ERROR] failed setup database: ", e);
    console.error("[WARN] Check the database connection and try again...");
  }
}