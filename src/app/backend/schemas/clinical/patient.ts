import { Schema } from "mongoose";
import { randomInt } from "crypto";
import { 
  Responsables, 
  Group, 
} from "@/app/backend/api/clinical/types";

const patientSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  registerNumber: {
    type: Number,
    default: ()=>randomInt(111111111, 999999999),
    unique: true,
  },
  birthDate: Date,
  age: Number,
  civilState: String,
  gender: String,
  tel: String,
  documentation: {
    type: String,
    unique: true,
    required: true,
  },
  lang: String,
  served: {
    type: Boolean,
    default: false
  },
  userId: Schema.Types.ObjectId
}, {
  collection: "patients",
  timestamps: true,
});

const demographySchema = new Schema({
  patientId: Schema.Types.ObjectId,
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
  patientId: Schema.Types.ObjectId,
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
  patientId: Schema.Types.ObjectId,
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

const accesTypeSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  type: {
    type: String,
  },
  externalUnitId: Schema.Types.ObjectId,
}, {
  collection: "patient_access_type",
  timestamps: true,
});

const processStateSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
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

export {
  patientSchema,
  demographySchema,
  responsibleSchema,
  accesTypeSchema,
  groupSchema,
  processStateSchema,
  specialtyStateSchema,
};