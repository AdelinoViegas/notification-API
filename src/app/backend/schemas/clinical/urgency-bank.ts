import { Schema } from "mongoose";

const anamnesis = new Schema({
  generalClinic: {
    symptoms: String,
    diseaseData: String,
    complementaryExams: String,
    diagnosticHypothesis: [ String ],
    others: String,
    evaluation: String,
    diseasesInFamily: String,
    eatingHabits: {
      meals: String,
      typeFood: String,
      waterConsumption: String,
      typeWater: String,
    },
    hospitalization: {
      description: String,
      dateTime: Date,
      currentState: String,
    },
    diseases: {
      diabetes: Boolean,
      hypertension: Boolean,
      respirationDiseases: Boolean,
      tuberculosis: Boolean,
      malaria: Boolean,
    },
    lifeStyle: {
      tabaccoConsumption: String,
      alcoholConsumption: {
        alcohol: String,
        frequency: String,
        amount: Number,      
      },
      physicalActivity: {
        exercise: String,
        type: { type: String },
        amount: Number,
        timeExercise: String,      
      },
    }
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

const urgencyService = new Schema({
  label: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  userId: Schema.Types.ObjectId,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  collection: "urgency_services",
  timestamps: true
});

export {
  urgencyBankSchema,
  urgencyService
}