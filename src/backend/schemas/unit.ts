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
  userId: Schema.Types.ObjectId,
}, {
  collection: "phisical_unit",
  timestamps: true,
});

const workplaceSchema = new Schema({
  userId: Schema.Types.ObjectId,
  workplaceId: Schema.Types.ObjectId,
  actor: Schema.Types.ObjectId, 
}, {
  collection: 'user_workplace_access',
  timestamps: true,
});

const externalUnitSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  street: String,
  municipality: String,
  province: String,
  userId: Schema.Types.ObjectId,
}, {
  collection: 'external_units',
  timestamps: true,
});

const scheduleServiceSchema = new Schema({
  scheduleId: Schema.Types.ObjectId,
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
    userId: Schema.Types.ObjectId,
  },
  userId: Schema.Types.ObjectId,
  Type: { 
    type: String,
    enum: UNIT_TYPES
  },
}, {
  timestamps: true,
  collection: "schedule_in_lab_imaging",
});

const serviceResultSchema = new Schema({
  resultId: Schema.Types.ObjectId,
  exams: [{
    _id: false,
    serviceId: Schema.Types.ObjectId, //o _id do examSchema
    storageId: String,
    description: String,
    sourceType: {
      type: String,
      enum: ["laboratory", "imaginig"],
      required: true
    },
    userId: Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: new Date()
    }
  }],
  userId: Schema.Types.ObjectId,
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
  patientId: Schema.Types.ObjectId,
  officeId: Schema.Types.ObjectId,
  storageId: String,
  userId: Schema.Types.ObjectId,
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