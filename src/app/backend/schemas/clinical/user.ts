import { Schema } from "mongoose";
import type { ClinicalUser } from "./types";

const userSchema = new Schema<ClinicalUser>({
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

const currentLocationSchema = new Schema({
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

const notificationSchema = new Schema({
  title: String,
  sinopse: String,
  type: {
    type: String
  },
  target: String,
  isReaded: {
    type: Boolean,
    default: false
  },
  readByUsers: [
    {
      userId: Schema.Types.ObjectId,
      readedAt: Date,
      _id: false
    }
  ],
  priority: String,
  reader: Schema.Types.ObjectId,
  creator: Schema.Types.ObjectId,
  visible: {
    type: Boolean,
    default: true
  },
  deletedBy: {
    userId: Schema.Types.ObjectId,
    deletedAt: Date
  },
  targetDataId: Schema.Types.ObjectId
}, {
  collection: "notifications",
  timestamps: true
});

export {
  userSchema,
  currentLocationSchema,
  notificationSchema
};