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