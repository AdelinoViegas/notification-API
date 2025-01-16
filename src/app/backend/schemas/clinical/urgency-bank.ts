import { Schema } from "mongoose";

const anamnesis = new Schema({
  generalClinic: {
    mainComplaint: String,
    symptoms: String,
    complementaryExams: String,
    diagnosticHypothesis: String,
    diabetes: String,
    hypertension: String,
    respiratoryDiseases: String,
    tuberculosis: String,
    malaria: String,
    others: String,
    signsOfVitalOrgans: String,
    tobaccoConsumption: String,
    alcohol: String,
    frequency: String,
    alcoholAmount: String,
    physical: String,
    activity: String,
    physicalAmount: String,
    upTime: String,
    meals: String,
    food: String,
    waterConsumption: String,
    medicines: String,
    diseasesInTheFamily: String,
    detail: String,
    dateOfAdmission: String,
    hour: String,
    condition: String,
  },
 /* childrensMedicine: {

  },
  pediatricMedicine: {

  },
  phisicalMedicine: {

  },
  ophthalmologyDervices: {

  },*/
});

const urgencyBankSchema = new Schema({
  anamnesis: anamnesis,
}, {
  collection: "patient_urgency_bank",
  timestamps: true,
});

export {
  urgencyBankSchema
}