import { Schema } from "mongoose";

const blockSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  patientIdentification: {
    preoperativeDiagnosis: String,
    informedConsent: String,
    responsible: String,
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