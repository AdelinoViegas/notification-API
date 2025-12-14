import { Schema } from "mongoose";

const UNIT_TYPES = [ 
  "workplace", 
  "internment", 
  "laboratory", 
  "imaging", 
  "screening", 
  "urgency", 
  "laboratory", 
  "imaging" 
];

const unitSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  unitTypeId: {
    type: String,
    required: true,
    enum: UNIT_TYPES
  },
  wing: String,
  nursing: String,
  bed: Number,
  userId: Schema.ObjectId,
}, {
  collection: "phisical_unit",
  timestamps: true,
});

const workplaceSchema = new Schema({
  userId: Schema.ObjectId,
  workplaceId: Schema.ObjectId,
  actor: Schema.ObjectId, 
}, {
  collection: 'user_workplace_access',
  timestamps: true,
});

workplaceSchema.index({ userId: 1, workplaceId: 1 }, { unique: true });

const externalUnitSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  street: String,
  municipality: String,
  province: String,
  userId: Schema.ObjectId,
}, {
  collection: 'external_units',
  timestamps: true,
});

const scheduleServiceSchema = new Schema({
  scheduleId: Schema.ObjectId,
  served: {
    type: Boolean,
    default: false,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  archiving: {
    reason: String,
    userId: Schema.ObjectId,
  },
  userId: Schema.ObjectId,
  Type: { 
    type: String,
    enum: UNIT_TYPES
  },
}, {
  timestamps: true,
  collection: "schedule_in_lab_imaging",
});

const serviceResultSchema = new Schema({
  resultId: Schema.ObjectId,
  exams: [{
    _id: false,
    serviceId: Schema.ObjectId, //o _id do examSchema
    storageId: String,
    description: String,
    sourceType: {
      type: String,
      enum: ["laboratory", "imaginig"],
      required: true
    },
    userId: Schema.ObjectId,
    createdAt: {
      type: Date,
      default: new Date()
    }
  }],
  userId: Schema.ObjectId,
  isFinished: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  collection: "results_from_lab_imaging",
  timestamps: true
});  // para laboratorio e imagiologia (a principio)

const externalResultSchema = new Schema({
  patientId: Schema.ObjectId,
  officeId: Schema.ObjectId,
  storageId: String,
  userId: Schema.ObjectId,
}, {
  collection: "office_external_results",
  timestamps: true,
});

const internalExamResultSchema = new Schema({
  serviceId: Schema.ObjectId, // ex: laboratorio ou imagionogia
  description: String,
  storageId: String, // id do arquivo da api,
  examId: Schema.ObjectId,
  userId: Schema.ObjectId
}, {
  timestamps: true
});

export {
  unitSchema,
  workplaceSchema,
  externalUnitSchema,
  scheduleServiceSchema,
  serviceResultSchema,
  externalResultSchema,
  internalExamResultSchema
};