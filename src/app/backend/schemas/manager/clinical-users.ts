import { Schema } from 'mongoose';

const clinicalUserSchema = new Schema({
  userId: Schema.Types.ObjectId,
  orderNumber: Number,
  groupRole: Schema.Types.ObjectId,
}, {
  collection: 'clinical_users',
  timestamps: true,
});

export default clinicalUserSchema;