import { Schema } from "mongoose";

const postAnestheticRecovery = new Schema({
  checkInTime: Date,
  checkOutTime: Date,
  vitalSignal: [{
    date: Date,
    fr: Number,
    pulse: Number,
    spo2: Number,
    ta: String,
    t: Number,
  }],
  levelofConsciousness: {
    motorActivity: Number,
    respiration: Number,
    circulation: Number,
    consciousness: Number,
    saturation: Number,
    result: String,
  },
  medicationAdministered: String,
  postAnestheticEvents: String,
}, {_id: false});

const operatingRoomSchema = new Schema({
  scheduleId: Schema.ObjectId,
  userId: Schema.ObjectId,
  patientIdentification: {
    preoperativeDiagnosis: String,
    informedConsent: String,
    responsible: String,
  },
  preoperativeEvaluation: {
    medicalAndsurgicalHistory: String,
    allergies: String,
    laboratoryTests: {
      externalId: Schema.ObjectId,
      description: String,
    },
    imagingTests: {
      externalId: Schema.ObjectId,
      description: String,
    },
    currentClinicalStatus: String,
    surgicalRisk: String,
    fastingConfirmed: String,
    previousMedication: String,
  },
  sugeryPlanning: {
    surgicalTeam: String,
    designatedRoom: String,
    materialsAndEquipment: String,
    implantableDevices: String,
  },
  checkSecurity: {
    patientIdentity: {
      type: Boolean,
      required: false,
      default: null,
    },
    surgerySite: String,
    validConsent: {
      type: Boolean,
      required: false,
      default: null,
    },
    anestheticRisk: {
      type: Boolean,
      required: false,
      default: null,
    },
    bloodAndEmergencySupplies: {
      type: Boolean,
      required: false,
      default: null,
    }
  },
  intraoperativeProcedure:{
    startTime: Date,
    endTime: Date,
    typeOfAnesthesia: String,
    surgicalTechnique: String, 
    implantsAndProsthesesUsed: String,
    intraoperativeComplications: String,
    fluidVolumeAndBloodLoss: String,
    medicationAdministered: String,
    otherProcedure: String,
  },
  postAnestheticRecovery,
  patientDischarge: {
    surgicalInformation: String,
    postOperativeIndications: {
      diet: String,
      analgesia: String,
      mobilization: String,
      antibiotics: String,
    }
  },
  served: {
    type: Boolean,
    default: false,
  },
  archiving: {
    reason: String,
    userId: Schema.ObjectId,
  },
}, {
  collection: "patient_operating_room",
  timestamps: true,
});

const operatingRoomResultSchema = new Schema({
  patientId: Schema.ObjectId,
  operatingRoomId: Schema.ObjectId,
  storageId: String,
  userId: Schema.ObjectId,
}, {
  collection: "operating_room_external_results",
  timestamps: true,
});


export {
  operatingRoomSchema,
  operatingRoomResultSchema,
}