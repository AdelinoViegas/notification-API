import { Schema } from "mongoose";

const anamnesis = new Schema({
  generalClinic: {
    symptoms: String,
    diseaseData: String,
    complementaryExams: String,
    diagnosticHypothesis: String,
    others: String,
    evaluation: String,
    diseasesInFamily: String,
  },
 /* childrensMedicine: {

  },
  pediatricMedicine: {

  },
  phisicalMedicine: {

  },
  ophthalmologyDervices: {

  },*/
},{ _id: false });

const urgencyBankSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  anamnesis: anamnesis,
}, {
  collection: "patient_urgency_bank",
  timestamps: true,
});

export {
  urgencyBankSchema
}