import { Schema } from "mongoose";
import { Prescription } from "./types";

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
        required: false,
        default: null,
      },
      hypertension: {
        type: Boolean,
        required: false,
        default: null,
      },
      respiratoryDiseases: {
        type: Boolean,
        required: false,
        default: null,
      },
      tuberculosis:  {
        type: Boolean,
        required: false,
        default: null,
      },
      malaria:  {
        type: Boolean,
        required: false,
        default: null,
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


 const medicalDiary =  new Schema({
    date: Date,
    description: String,
 });

 const therapeuticDiary =  new Schema({
    date: Date,
    signature: String,
    description: String,
 });

  const treatmentDiary =  new Schema({
    date: Date,
    signature: String,
    description: String,
  });

  const vitalSignals =  new Schema({
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
      spO2:{
        type: Number,
        default: 0,
      },
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
  });

  const nursingNotes = new Schema({
    date: Date,
    description: String,
  });

  const hydromineralBalance = new Schema({
    date: Date,
    siteOfDrugAdministration: String, 
    amount: String,
    hidromineralBalance: String,
    description: String,
  });


const urgencyBankSchema = new Schema({
  patientId: Schema.ObjectId,
  triedId: Schema.ObjectId,
  patientStatus: String,
  anamnesis: anamnesis,
  clinicalDiary: {
    medicalDiary: [medicalDiary],
    therapeuticDiary: [therapeuticDiary],
    treatmentDiary: [treatmentDiary],
    vitalSignals: [vitalSignals],
    nursingNotes: [nursingNotes],
    hydromineralBalance: [hydromineralBalance],
  },
  served: {
    type: Boolean,
    default: false
  }
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
  userId: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  collection: "urgency_services",
  timestamps: true
});

const patientHospitalizedSchema = new Schema({
  urgencyId: Schema.ObjectId,
  userId: String,
  description: String,
  donedAt: Date,
  patientState: String,
  hospitalizedId: Schema.ObjectId,
  currentState: String
}, {
  timestamps: true
});

const prescriptionSchema = new Schema<Prescription>({
  userId: String,
  description: String,
  makedAt: Date,
  urgencyId: Schema.ObjectId,
  patientId: Schema.ObjectId
}, {
  timestamps: true
});

const surgerySchema = new Schema({
  userId: String,
  description: String,
  patientId: Schema.ObjectId,
  resultId: Schema.ObjectId, // associar o resultado da cirurgia com este documento
  state: {
    type: String,
    enum: ["resolved", "rejected", "pending", "opened"],
    default: "opened"
  }
}, {
  timestamps: true
}); // deve ser processado todas as surgery em opened para o bloco operatório

export {
  urgencyBankSchema,
  urgencyService,
  patientHospitalizedSchema,
  prescriptionSchema,
  surgerySchema
}