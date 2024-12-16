import { createConnection } from "mongoose";

const managerDB = String(process.env.MASTER_KERNEL)+String(process.env.SUFFIX_DB);
const clinicalDB = String(process.env.MASTER_CLINICAL)+String(process.env.SUFFIX_DB); 
const clinical = createConnection(clinicalDB);
const kernel = createConnection(managerDB);

export {
  kernel,
  clinical
}

