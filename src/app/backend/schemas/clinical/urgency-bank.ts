import { Schema } from "mongoose";

const anamnesis = new Schema({
  generalClinic: {
    symptoms: String,
    diseaseData: String,
    complementaryExams: String,
    diagnosticHypothesis: {
      type: [ String ],
      default: []
    },
    others: String,
    evaluation: String,
    diseasesInFamily: String,
    eatingHabits: {
      meals: String,
      typeFood: String,
      waterConsumption: String,
      typeWater: String,
    },
    diseases: {
      diabetes: {
        type: Boolean,
        default: false,
      },
      hypertension: {
        type: Boolean,
        default: false,
      },
      respiratoryDiseases: {
        type: Boolean,
        default: false,
      },
      tuberculosis:  {
        type: Boolean,
        default: false,
      },
      malaria:  {
        type: Boolean,
        default: false,
      },
    },
    lifeStyle: {
      tabaccoConsumption: {
        type: String,
        default: "non-smoker",
      },
      alcoholConsumption: {
        alcohol: {
          type: String,
          default: "doesn't-consume",
        },
        frequency: String,
        amount: Number,      
      },
      physicalActivity: {
        exercise: {
          type: String,
          default: "non-practitioner",
        },
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

const clinicalDiary = new Schema({
  medicalDiary : [{
    date: Date,
    description: String,
  }],
  therapeuticDiary:[{
    date: Date,
    signature: String,
    description: String,
  }],
  treatmentDiary:[{
    date: Date,
    signature: String,
    description: String,
  }],
  vitalSignals: [{
    date: Date,
    description: String,
    vitalSignals: {
      paMax: {
        type: Number,
        default: 0,
      },
      paMin: {
        type: Number,
        default: 0,
      },
      jump: {
        type: Number,
        default: 0,
      },
      pvc: {
        type: Number,
        default: 0
      },
      imc: {
        type: Number,
        default: 0,
      },
      sp02: Number,
      temperature: {
        type: Number,
        default: 0,
      },
      breathing: {
        type: Number,
        default: 0,
      },
      weight: {
        type: Number,
        default: 0,
      },
      height: {
        type: Number,
        default: 0,
      },
      bloodGlucose: {
        type: Number,
        default: 0
      },
    },
  }],
  nursingNotes: [{
    date: Date,
    description: String,
  }],
  hydromineralBalance: [{
    date: Date,
    siteOfDrugAdministration: String, 
    amount: String,
    hidromineralBalance: String,
    description: String,
  }]
},{_id: false});

const urgencyBankSchema = new Schema({
  patientId: Schema.Types.ObjectId,
  anamnesis: anamnesis,
  clinicalDiary: clinicalDiary,
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