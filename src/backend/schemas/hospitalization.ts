import { Schema } from "mongoose";

export const hospitalizationSchema = new Schema({
  fromServiceId: Schema.Types.ObjectId,
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
});

