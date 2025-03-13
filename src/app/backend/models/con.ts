import { createConnection } from "mongoose";

const managerDB = process.env.MODE === "container" 
? "mongodb://internal.containers.host:27017/mw_manager"
: String(process.env.MASTER_KERNEL)+String(process.env.SUFFIX_DB);
const clinicalDB = process.env.MODE === "container" 
? "mongodb://internal.containers.host:27017/mw_clinical"
: String(process.env.MASTER_CLINICAL)+String(process.env.SUFFIX_DB); 

const clinical = createConnection(clinicalDB);
const kernel = createConnection(managerDB);

export {
  kernel,
  clinical
}

