import { Schema } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    unique: true,
  },
  orderNumber: Number,
  officeId: String,
  roleId: Schema.Types.ObjectId,
  categoryId: String, // do arquivo translator.ts
}, {
  timestamps: true,
  collection: "user",
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
  }
}, {
  collection: "notifications",
  timestamps: true
});

export {
  userSchema,
  currentLocationSchema,
  notificationSchema
};