import { Schema } from "mongoose";

export const hospitalizationSchema = new Schema({
  fromServiceId: Schema.ObjectId,
  patientId: Schema.ObjectId,
  toInternalServiceId: Schema.ObjectId,
  triedId: Schema.ObjectId,
  userId: String,
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
  internalServiceId: 1 
}, { 
  unique: true 
}); // criação de indice

export const nursingSchema = new Schema({
  sectionId: Schema.ObjectId,
  internalServiceId: Schema.ObjectId,
  name: String,
  maxBedNumber: {
    type: Number,
    default: 0
  }
});

nursingSchema.index({ internalServiceId: 1, name: 1 }, {
  unique: true
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
  userId: String
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

export const namePatternsSchema = new Schema({
  to: {
    type: String,
    enum: ["bed", "nursing", "urgency"],
    required: true,
    unique: true
  },
  regex: {
    type: String,
    required: true
  }
});