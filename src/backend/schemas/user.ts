import { Schema } from "mongoose";
import type { ClinicalUser } from "./types";

export const userSchema = new Schema<ClinicalUser>({
  userId: {
    type: String,
    unique: true,
  },
  orderNumber: Number,
  serviceId: Schema.ObjectId,
  specialtyId: Schema.ObjectId,
  internalServiceId: Schema.ObjectId,
  categoryId: {
    type: String,
    enum: ["doctor", "nurse", "others"],
    default: "others"
  }, // do arquivo translator.ts
  officeId: Schema.ObjectId
}, {
  timestamps: true,
  collection: "users",
});

export const currentLocationSchema = new Schema({
  locationId: Schema.ObjectId,
  userId: String,
  isActive: {
    type: Boolean,
    default: true,
  }  
}, {
  collection: "current_workplace",
  timestamps: true,
});