import { Schema } from "mongoose";

export const hospitalizationSchema = new Schema({
  fromServiceId: Schema.Types.ObjectId,
  patientId: Schema.Types.ObjectId,
  toInternalServiceId: Schema.Types.ObjectId,
  triedId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  served: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

hospitalizationSchema.index({ patientId: 1, served: 1}, { unique: true }); 

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
  sectionId: Schema.Types.ObjectId,
  internalServiceId: Schema.Types.ObjectId,
  name: String,
  maxBedNumber: {
    type: Number,
    default: 0
  }
});

export const sectionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
});

export const inHospitalizeSchema = new Schema({
  patientId: String,
  processNumber: {
    type: Number,
    default: Date.now() + Math.ceil(Math.random() * 10)
  },
  bedId: Schema.ObjectId,
  served: {
    type: Boolean,
    default: false
  },
  userId: Schema.ObjectId
}, {
  timestamps: true
});

inHospitalizeSchema.index({ patientId: 1, served: 1 }, { unique: true });

export const internalMovimentsSchema = new Schema({
  patientId: Schema.ObjectId,
  from: Schema.ObjectId,
  to: Schema.ObjectId,
  by: Schema.ObjectId
}, {
  timestamps: true
});