import { Schema } from "mongoose";

const permissionSchema = new Schema({
  label: String,
  userGroupId: Schema.Types.ObjectId,
  detail: String,
  route: {
    type: String,
    lowercase: true,
    unique: true,
  },
}, {
  timestamps: true,
  collection: 'permission'
});

const accessPermissionSchema = new Schema({
  userId: Schema.Types.ObjectId,
  permissionId: Schema.Types.ObjectId,
},{
  collection: 'granted_permission',
  timestamps: true
});

export {
  permissionSchema,
  accessPermissionSchema
}