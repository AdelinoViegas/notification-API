import { Schema } from "mongoose";

const blockSchema = new Schema({
  patientId: Schema.Types.ObjectId,
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
  served: {
    type: Boolean,
    default: false
  }

}, {
  collection: "patient_operating_room",
  timestamps: true,
});

export {
  blockSchema
}