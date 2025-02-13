import { Schema } from "mongoose";

const screeningSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  adviceId: Schema.Types.ObjectId,
  reason: {
    type: String,
    trim: true
  },
  advice: {
    type: String,
    trim: true
  },
  priority:{
    type: String,
    trim: true,
    lowercase: true
  },
  state: {
    type: String,
    trim: true
  },
  vitalSignals: {
    paMax: Number,
    paMin: Number,
    jump: Number,
    pvc: Number,
    imc: Number,
    sp02: Number,
    temperature: Number,
    breathing: Number,
    weight: Number,
    height: Number,
    bloodGlucose: Number,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  served: {
    type: Boolean,
    default: false
  },
}, {
  collection: "screening",
  timestamps: true,
});

const reasonSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  inScreeningId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  detail: {
    type: String,
    trim: true
  },
}, {
  timestamps: true,
  collection: "screening_reason"
});

const adviceSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  inScreeningId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  detail: {
    type: String,
    trim: true
  },
}, {
  timestamps: true,
  collection: "screening_advice"
});

const prioritySchema = new Schema({
  patientId: Schema.Types.ObjectId,
  inScreeningId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  priority: {
    type: String,
    trim: true
  },
}, {
  timestamps: true,
  collection: "screening_priority"
});

const statusSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  inScreeningId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  detail: {
    type: String,
    trim: true
  },
}, {
  timestamps: true,
  collection: "screening_status"
});

const vitalSignalSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  inScreeningId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  paMax: Number,
  paMin: Number,
  jump: Number,
  pvc: Number,
  imc: Number,
  sp02: Number,
  temperature: Number,
  breathing: Number,
  weight: Number,
  height: Number,
  bloodGlucose: Number,
}, {
  timestamps: true,
  collection: "screening_vital_signal"
});

const triedSchema = new Schema({
  inScreeningId: Schema.Types.ObjectId,
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  serviceId: Schema.Types.ObjectId
}, {
  timestamps: true,
  collection: "tried_to_urgency_bank"
});

export {
  screeningSchema,
  reasonSchema,
  adviceSchema,
  prioritySchema,
  vitalSignalSchema,
  statusSchema,
  triedSchema
};