import { createConnection } from "mongoose";
debugger;
const clinical = createConnection(`${process.env.MONGO_URL}`, { dbName: "clinical" });
const kernel = createConnection(`${process.env.MONGO_URL}`, { dbName: "manager" });

export { kernel, clinical }

