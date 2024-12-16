import { Schema } from "mongoose";

const accessLimitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    unique: true,
  },
  startAt: Date,
  endAt: Date,
  day: Number
},{
  collection: 'access_limit',
  timestamps: true
});

export default accessLimitSchema;