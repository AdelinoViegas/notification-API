import { Schema } from 'mongoose';

const userGroupSchema = new Schema({
  label: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
    lowercase: true,
  },
  route: {
    type: String,
    lowercase: true,
    unique: true
  }
}, {
  timestamps: true,
  collection: 'user_groups'
});

export default userGroupSchema;