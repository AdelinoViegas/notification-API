import { Schema } from "mongoose";
import type { ClinicalUser } from "./types";

export const userSchema = new Schema<ClinicalUser>({
  userId: {
    type: Schema.Types.ObjectId,
    unique: true,
  },
  orderNumber: Number,
  serviceId: Schema.Types.ObjectId,
  specialtyId: Schema.Types.ObjectId,
  categoryId: String, // do arquivo translator.ts
  officeId: Schema.Types.ObjectId
}, {
  timestamps: true,
  collection: "users",
});

export const currentLocationSchema = new Schema({
  locationId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  isActive: {
    type: Boolean,
    default: true,
  }  
}, {
  collection: "current_workplace",
  timestamps: true,
});