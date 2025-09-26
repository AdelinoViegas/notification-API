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