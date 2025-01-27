import { Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: new RegExp("^[a-zA-Z]+$")
  },
  fullname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  email: String,
  tel: String,
  userGroupId: Schema.Types.ObjectId,
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'users'
});

const loginAccessTokensSchema = new Schema({
  userId: Schema.Types.ObjectId,
  token: String,
  inUse: {
    type: Boolean,
    default: true,
  },
  fingerPrint: {
    browser: String,
    ip: String,
  }
}, {
  timestamps: true,
  collection: "login_access_log"
})

export {
  loginAccessTokensSchema,
  userSchema
}

