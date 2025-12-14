import { randomInt } from "crypto";
import { Schema } from "mongoose";
import { ConsultResult } from "./types";

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    default: () => randomInt(111111, 999999)
  },
  categoryId: Schema.ObjectId,
  classificationId: Schema.ObjectId,
  groupId: Schema.ObjectId,
  specialtyId: Schema.ObjectId,
  kind: {
    type: String,
    enum: [ "surgery" , "consultation", "exam" ],
    required: true
  },
  price: {
    type: Number,
    default: 0,
  },
});

serviceSchema.index({ name: 1, code: 1, kind: 1 }, { unique: true });

const examGroupSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
}, {
  collection: "exam_group"
});

const examCategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
}, {
  collection: "exam_category"
});

const examClassificationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
}, {
  collection: "exam_classification"
});

const scheduleExamSchema = new Schema({
  patientId: Schema.ObjectId,
  exams: [ Schema.ObjectId ],
  laboratoryId: Schema.ObjectId,
  dateTime: Date,
  Type: String,
  payment: {
    status: {
      type: String,
      default: "pending" // pendente ou confirmado
    }, 
    invoice: {
      code: String,
      proof: String,
      porcentage: {
        type: String,
        default: "0%",
      },
      value: {
        type: Number,
        default: 0, // procentual 1.0 (float) -> 100% 
      }
    }
  },
  served: {
    type: Boolean,
    default: false,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  detail: String,
  userId: Schema.ObjectId,
}, {
  collection: "schedule_patient_exam",
  timestamps: true,
});

const scheduleAppointmentSchema = new Schema({
  patientId: Schema.ObjectId,
  doctorId: Schema.ObjectId,
  userId: Schema.ObjectId,
  doctorTime: String,
  consultId: Schema.ObjectId,
  doctorDay: Date,
  detail: String,
  payment: {
    status: {
      type: String,
      default: "pending" // pendente ou confirmado
    }, 
    invoice: {
      code: String,
      proof: String,
      porcentage: {
        type: String,
        default: "0%",
      },
      value: {
        type: Number,
        default: 0, // procentual 1.0 (float) -> 100% 
      }
    }
  },
  dateTime: Date,
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
  doctorReschedule: {
    type: Boolean,
    default: false,
  }
}, {
  collection: "schedule_appointment",
  timestamps: true,
});


const examResultSchema = new Schema({
  scheduleId: Schema.ObjectId,
  detail: String,
  userId: Schema.ObjectId,
}, {
  collection: "schedule_exam_result",
  timestamps: true,
});


const examCancelSchema = new Schema({
  scheduleId: Schema.ObjectId,
  reason: {
    type: String,
    required: true,
  },
  userId: Schema.ObjectId,
}, {
  collection: "schedule_exam_cancel",
  timestamps: true,
});

const appointmentCancelSchema = new Schema({
  scheduleId: Schema.ObjectId,
  reason: {
    type: String,
    required: true,
  },
  userId: Schema.ObjectId,
}, {
  collection: "schedule_appointment_cancel",
  timestamps: true,
});

const doctorCalendarSchema = new Schema({
  description: String,
  month: Number,
  doctors: [
    {
      doctorId: Schema.ObjectId,
      initialTime: String,
      finalTime: String,
      room: String,
      day: Date,
      _id: false,
    }
  ],
  maxSchedule: Number,
  userId: Schema.ObjectId,
  signatureDateTo: {
    type: String,
    unique: true,
    required: true,
  }
}, {
  collection: "doctor_calendar",
  timestamps: true,
});

const officeSchema = new Schema<ConsultResult>({
  scheduleId: Schema.ObjectId,
  externalId: Schema.ObjectId,
  served: {
    type: Boolean,
    default: false,
  },
  archiving: {
    reason: String,
    userId: Schema.ObjectId,
  },
  userId: Schema.ObjectId,
  results: {
    vitalSignal: {
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
    currentStates: {
      complaints: String,
      phisicalExam: String,
      detail: String,
    },
    status: { // para controlar se o preechimento dos campos está concluída
      vitalSignal: {
        type: Boolean,
        default: false
      },
      currentStates: {
        type: Boolean,
        default: false
      },
    },
    storageId: String
  },
}, {
  timestamps: true,
  collection: "schedule_in_office",
});

const scheduleSugerySchema = new Schema({
  patientId: Schema.ObjectId,
  doctorId: Schema.ObjectId,
  sugeryType: Schema.ObjectId,
  sugeryDate: Date,
  sugeryTime: String,
  description: String,
  requestingService: String,
  infirmary: String,
  bed: String,
  payment: {
    status: {
      type: String,
      default: "pending" // pendente ou confirmado
    }, 
    invoice: {
      code: String,
      proof: String,
      porcentage: {
        type: String,
        default: "0%",
      },
      value: {
        type: Number,
        default: 0, // procentual 1.0 (float) -> 100% 
      }
    }
  },
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
  }
}, {
  collection: "schedule_sugery",
  timestamps: true,
});

const serviceRequestsSchema = new Schema({
  patientId: Schema.ObjectId,
  from: { 
    type: String,
    enum: [ "consultation", "urgency", "surgery" ],
    required: true
  },
  originOfrequest: String,
  userId: Schema.ObjectId,
  kind: Schema.ObjectId,
  pending: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

serviceRequestsSchema.index({ 
  patientId: 1, 
  from: 1, 
  userId: 1, 
  kind: 1,
  pending: 1
}, { unique: true });

export{
  examGroupSchema,
  scheduleExamSchema,
  examResultSchema,
  examCategorySchema,
  examClassificationSchema,
  examCancelSchema,
  appointmentCancelSchema,
  doctorCalendarSchema,
  scheduleAppointmentSchema,
  officeSchema,
  scheduleSugerySchema,
  serviceRequestsSchema,
  serviceSchema
}