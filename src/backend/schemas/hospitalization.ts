import { Schema } from "mongoose";

export const hospitalizationSchema = new Schema({
  fromServiceId: Schema.Types.ObjectId,
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
});

export const internalServiceSchema = new Schema({ 
  name: {
    type: String,
    required: true,
    unique: true
  } 
});

export const bedNursingSchema = new Schema({
  internalServiceId: Schema.ObjectId,
  nursingId: Schema.ObjectId,
  bed: String
}, {
  timestamps: true
});

bedNursingSchema.index({ 
  bed: 1, 
  nursingId: 1, 
  internalServiceSchema: 1 
}, { 
  unique: true 
}); // criação de indice

export const nursingSchema = new Schema({
  sectionId: Schema.ObjectId,
  name: String,
  maxBedNumber: {
    type: Number,
    default: 0
  }
});

export const sectionSchema = new Schema({ name: String });