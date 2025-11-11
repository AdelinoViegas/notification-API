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
    paMax: {
      type: Number,
      default: 0,
    },
    paMin: {
      type: Number,
      default: 0,
    },
    jump: {
      type: Number,
      default: 0,
    },
    pvc: {
      type: Number,
      default: 0
    },
    imc: {
      type: Number,
      default: 0,
    },
    sp02: {
      type: Number,
      default: 0,
    },
    temperature: {
      type: Number,
      default: 0,
    },
    breathing: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    bloodGlucose: {
      type: Number,
      default: 0
    },
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

const triedSchema = new Schema({
  srcId: Schema.Types.ObjectId,
  patientId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  serviceId: Schema.Types.ObjectId,
  reasonChangingServices: String, 
  served: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: "tried_to_urgency_back"
});

export {
  screeningSchema,
  triedSchema
};