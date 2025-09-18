import { Schema } from "mongoose";

export const hospitalizationSchema = new Schema({
  fromServiceId: Schema.Types.ObjectId,
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
});

export const internalServiceSchema = new Schema({ name: String });

export const bedNursingSchema = new Schema({
  internalServiceId: Schema.ObjectId,
  nursingId: Schema.ObjectId,
  bed: String
}, {
  timestamps: true
});

export const nursingSchema = new Schema({
  sectionId: Schema.ObjectId,
  name: String,
  maxBedNumber: {
    type: Number,
    default: 0
  }
});

export const sectionSchema = new Schema({ name: String });