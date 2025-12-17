import { Schema } from "mongoose";
import { Responsables, Group } from "@/backend/api/clinical/types";
import { AngolaProvices } from "@/backend/api/clinical/translator";

const patientSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  registerNumber: Number,
  birthDate: Date,
  civilState: String,
  gender: String,
  tel: String,
  documentation: String,
  transfered: {
    type: Boolean,
    default: false
  },
  lang: String,
  served: {
    type: Boolean,
    default: false
  },
  userId: Schema.ObjectId,
  used: Boolean
}, {
  timestamps: true,
});

export const externalTransferSchema = new Schema({
  patientId: Schema.ObjectId,
  userCreatedAt: Date,
  unitId: Schema.ObjectId,
  userId: Schema.ObjectId,
  reason: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const demographySchema = new Schema({
  patientId: Schema.ObjectId,
  nationality: String,
  naturality: String,
  province: String,
  actualLocation: String,
  street: String,
  homeNumber: String,
}, {
  collection: "patient_demography",
  timestamps: true,
});

const responsibleSchema = new Schema<Responsables>({
  patientId: Schema.ObjectId,
  responsibles: [
    { 
      name: String,  
      kinship: String,
      tel: String,
      _id: false,
    }
  ],      
}, {
  collection: "patient_responsible",
  timestamps: true,
});

const groupSchema = new Schema<Group>({
  patientId: Schema.ObjectId,
  type: {
    type: String,
  },
  group: {
    name: String,
    apolice: Number,
    tel: String,
    detail: String,
    passNumber: String,
    role: String,
    workArea: String,
  }
}, {
  collection: "patient_group",
  timestamps: true,
});

const accessTypeSchema = new Schema({
  patientId: Schema.ObjectId,
  type: { type: String },
  externalUnitId: Schema.ObjectId,
}, {
  collection: "patient_access_type",
  timestamps: true,
});

const processStateSchema = new Schema({
  patientId: Schema.ObjectId,
  userId: Schema.ObjectId,
  location: {
    type: String,
    required: true,
    lowercase: true,
  },
  isInUse: {
    type: Boolean,
    required: true,
  }
}, {
  timestamps: true,
  collection: "patient_process_access"
});

const specialtyStateSchema = new Schema({
  name:{
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
  collection: "user_specialty"
});

const patientSyncSchema = new Schema({
  id: Schema.ObjectId,
  secondaries: [ Schema.ObjectId ]
}, { 
  timestamps: true 
});

patientSyncSchema.index({ id: 1, secondaries: 1 }, { unique: true });

const municipalitySchema = new Schema({
  proviceId: { 
    type: String,
    required: true,
    enum: AngolaProvices.map(e => e._id)
  },
  municipality: String
});

const patientStateSchema = new Schema({
  patientId: Schema.ObjectId,
  stateId: {
    type: String,
    enum: [
      "critical",
      "serious",
      "moderate",
      "recovered",
      "deceased"
    ],
    required: true
  }
});

const patientExitSchema = new Schema({
  patientId: {
    type: Schema.ObjectId,
    required: true,
    unique: true
  },
  userId: Schema.ObjectId,
  userEventAt: {
    type: Date,
    default: new Date
  },
  lockProfileState: {
    type: Boolean,
    default: false
  },
  where: {
    type: String,
    required: true,
    enum: [
      "transfer",
      "high"
    ]
  },
}, {
  timestamps: true
});

export {
  patientSchema,
  demographySchema,
  responsibleSchema,
  accessTypeSchema,
  groupSchema,
  processStateSchema,
  specialtyStateSchema,
  patientSyncSchema,
  municipalitySchema,
  patientStateSchema,
  patientExitSchema
};