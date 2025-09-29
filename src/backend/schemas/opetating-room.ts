import { Schema } from "mongoose";

const postAnestheticRecovery = new Schema({
  checkInTime: Date,
  checkOutTime: Date,
  vitalSignal: [{
    date: Date,
    fr: Number,
    pulse: Number,
    spo2: Number,
    ta: Number,
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
  scheduleId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  patientIdentification: {
    preoperativeDiagnosis: String,
    informedConsent: String,
    responsible: String,
  },
  preoperativeEvaluation: {
    medicalAndsurgicalHistory: String,
    allergies: String,
    laboratoryTests: String,
    imagingTests: String,
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
  served: {
    type: Boolean,
    default: false,
  },
  archiving: {
    reason: String,
    userId: Schema.Types.ObjectId,
  },
}, {
  collection: "patient_operating_room",
  timestamps: true,
});

export {
  operatingRoomSchema
}