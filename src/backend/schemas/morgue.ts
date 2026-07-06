import { Schema } from "mongoose";

/** Cadastro de Câmaras e Gavetas */
export const morgueChamberSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  maxDrawers: {
    type: Number,
    required: true,
    default: 10
  }
}, {
  timestamps: true
});

/**
 * Registo de acomodação do falecido na morgue.
 * served: false = corpo presente | true = corpo saiu
 */
export const morgueAccommodationSchema = new Schema({
  patientId: {
    type: Schema.ObjectId,
    required: true
  },
  chamberId: {
    type: Schema.ObjectId,
    required: true
  },
  drawer: {
    type: String,
    required: true
  },
  responsible: {
    name: String,
    idNumber: String,
    contact: String,
    kinship: String
  },
  served: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

morgueAccommodationSchema.index({ patientId: 1, served: 1 }, { unique: true });

/** Registo de saída do corpo */
export const morgueExitSchema = new Schema({
  accommodationId: Schema.ObjectId,
  patientId: Schema.ObjectId,
  responsibleExit: {
    name: String,
    idNumber: String,
    contact: String,
    kinship: String
  },
  transportType: {
    type: String,
    enum: ["family", "funeral_agency"],
    required: true
  },
  transportFamily: {
    name: String,
    kinship: String,
    idNumber: String,
    contact: String
  },
  transportAgency: {
    name: String,
    responsible: String,
    driver: String,
    vehicleBrand: String,
    vehicleColor: String,
    licensePlate: String
  },
  documents: {
    deathCertificate: { type: Boolean, default: false },
    familyAuthorization: { type: Boolean, default: false },
    agencyTransportGuide: { type: Boolean, default: false },
    judicialAuthorization: { type: Boolean, default: false }
  },
  destinationType: {
    type: String,
    enum: ["home", "cemetery", "wake", "military_unit", "other"],
    required: true
  },
  destinationOther: String
}, {
  timestamps: true
});
