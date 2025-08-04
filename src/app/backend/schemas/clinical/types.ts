import type { Document, Types } from "mongoose";

export interface ClinicalUser extends Document {
  userId: Types.ObjectId;
  orderNumber: number;
  serviceId: Types.ObjectId;
  specialtyId: Types.ObjectId;
  categoryId: Types.ObjectId;
  officeId: Types.ObjectId;
}