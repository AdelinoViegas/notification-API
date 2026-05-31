import { Schema } from "mongoose";

export const dischargeHistorySchema = new Schema({
  patientId: {
    type: Schema.ObjectId,
    required: true
  },
  processNumber: Number,
  patientName: {
    type: String,
    required: true
  },
  internalServiceName: String,
  nursingName: String,
  bedName: String,
  admissionDate: Date,
  dischargeDate: Date,
  dischargeType: {
    type: String,
    enum: ["hospital", "medical"],
    default: "hospital"
  },
  admissionDiagnosis: String,
  doctorName: String,
  doctorId: String,
  status: {
    type: String,
    enum: ["active", "locked"],
    default: "locked"
  },
  patientExitId: Schema.ObjectId,
}, {
  timestamps: true
});

dischargeHistorySchema.index({ patientId: 1, dischargeDate: -1 });
