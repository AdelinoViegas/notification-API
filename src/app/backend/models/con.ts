import { createConnection } from "mongoose";

const clinical = createConnection(`${process.env.MONGO_URL}/clinical`);
const kernel = createConnection(`${process.env.MONGO_URL}/manager`);

export { kernel, clinical }

