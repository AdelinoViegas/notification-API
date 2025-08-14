import type { Document, Types } from "mongoose";

export interface ClinicalUser extends Document {
  userId: Types.ObjectId;
  orderNumber: number;
  serviceId: Types.ObjectId;
  specialtyId: Types.ObjectId;
  categoryId: string;
  officeId: Types.ObjectId;
}

export interface Prescription extends Document {
  userId: Types.ObjectId;
  description: string;
  makedAt: Date;
  urgencyId: Types.ObjectId;
  patientId: Types.ObjectId;
}

export interface ConsultVitalSignal {
  paMax: number;
  paMin: number;
  jump: number;
  pvc: number;
  imc: number;
  sp02: number;
  temperature: number;
  breathing: number;
  weight: number;
  height: number;
  bloodGlucose: number;
}

export interface ConsultCurrentStates {
  complaints: string;
  phisicalExam: string;
  detail: string;
}

export interface ConsultResults {
  vitalSignal?: ConsultVitalSignal;
  currentStates?: ConsultCurrentStates;
  storageId?: string;
  status: {
    vitalSignal: boolean;
    currentStates: boolean;
  };
}

export interface ConsultResult extends Document {
  scheduleId: Types.ObjectId;
  served: boolean;
  archiving: boolean;
  userId: Types.ObjectId;
  results: ConsultResults;
  externalId: Types.ObjectId;
}