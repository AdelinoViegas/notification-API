import { createConnection } from "mongoose";
import { 
  userSchema, 
  currentLocationSchema
} from "@/backend/schemas/user";
import { 
  examGroupSchema,
  scheduleExamSchema,
  examResultSchema,
  serviceCategorySchema,
  examClassificationSchema,
  examCancelSchema,
  doctorCalendarSchema,
  scheduleAppointmentSchema,
  appointmentCancelSchema,
  officeSchema,
  scheduleSugerySchema,
  serviceRequestsSchema,
  serviceSchema,
} from "@/backend/schemas/scheduling";
import { 
  responsibleSchema,
  accessTypeSchema, 
  groupSchema, 
  patientSchema,
  demographySchema,
  processStateSchema,
  specialtyStateSchema,
  patientSyncSchema,
  patientStateSchema,
  patientExitSchema,
  externalTransferSchema,
  deceasedPatientSchema
} from "@/backend/schemas/patient";
import { 
  patientWaitingSchema,
  screeningSchema,
  triedSchema
} from "@/backend/schemas/screening";
import { 
  unitSchema, 
  workplaceSchema,
  externalUnitSchema, 
  scheduleServiceSchema,
  serviceResultSchema,
  externalResultSchema,
  internalExamResultSchema
} from "@/backend/schemas/unit";
import { 
  urgencyBankSchema, 
  urgencyService,
  patientHospitalizedSchema, 
  prescriptionSchema,
  surgerySchema
} from "@/backend/schemas/urgency-bank";
import { 
  bedNursingSchema, 
  hospitalizationSchema, 
  inHospitalizeSchema, 
  internalMovimentsSchema, 
  internalServiceSchema, 
  namePatternsSchema, 
  nursingSchema, 
  sectionSchema 
} from "@/backend/schemas/hospitalization";
import { operatingRoomResultSchema, operatingRoomSchema } from "@/backend/schemas/operating-room";
import { dischargeHistorySchema } from "@/backend/schemas/discharge-history";
import {
  morgueChamberSchema,
  morgueAccommodationSchema,
  morgueExitSchema,
} from "@/backend/schemas/morgue";
import dbConfigure from "./db.config";

export const db = createConnection(process.env.MONGO_URL as string, {
  family: process.env.NODE_ENV === "development" 
    ? 4 
    : undefined,
  appName: "erp-clinical-service"
});

db.on("connected", async ()=> await dbConfigure());

const userModel = db.model("User", userSchema);
const currentLocationModel = db.model("CurrentLocation", currentLocationSchema);
// patient
const patientModel = db.model('Patient', patientSchema);
const demographyModel = db.model('Demography', demographySchema);
const responsibleModel = db.model('Responsible', responsibleSchema);
const groupModel = db.model('PatientGroup', groupSchema);
const accessTypeModel = db.model('AcessType', accessTypeSchema);
const screeningModel = db.model('Screening', screeningSchema);
const processStateModel = db.model("ProcessState", processStateSchema);
const patientSyncModel = db.model("PatientSyncs", patientSyncSchema);
const triedModel = db.model("Tried", triedSchema);
const patientWaitingModel = db.model("PatientWaiting", patientWaitingSchema);
const patientStateModel = db.model("PatientState", patientStateSchema);
const patientExitModel = db.model("PatientExit", patientExitSchema);
const deceasedPatientModel = db.model("DeceasedPatient", deceasedPatientSchema);
export const externalTransferModel = db.model("ExternalTransfer", externalTransferSchema);

//agendamentos (schedulings)

const serviceModel = db.model("Service", serviceSchema);
const examGroupModel = db.model("ExamGroup", examGroupSchema);
const serviceCategoryModel = db.model('ExamCategory', serviceCategorySchema);
const examClassificationModel = db.model('ExamClassification', examClassificationSchema);
const scheduleExamModel = db.model("ScheduleExam", scheduleExamSchema);
const unitModel = db.model("Unit", unitSchema);
const examResultModel = db.model("ExameResult", examResultSchema)
const examCancelModel = db.model("ExamCancel", examCancelSchema);
const appointmentCancelModel = db.model("AppointmentCancel", appointmentCancelSchema);
const workplaceModel = db.model("WorkPlace", workplaceSchema);
const doctorCalendarModel = db.model("DoctorCalendar", doctorCalendarSchema);
const scheduleAppointmentModel = db.model("ScheduleAppointment", scheduleAppointmentSchema);
const specialtyModel = db.model("Expeciality",specialtyStateSchema);
const externalUnitModel = db.model('ExternalUnit', externalUnitSchema);
const officeModel = db.model('Office', officeSchema);
const scheduleServiceModel = db.model("Services", scheduleServiceSchema);
const serviceResultModel = db.model("ServiceResult", serviceResultSchema);
const externalResultsModel = db.model('ExternalResults', externalResultSchema);
const internalExamResultModel = db.model("InternalExamResult", internalExamResultSchema);
const scheduleSugeryModel = db.model("ScheduleSugery", scheduleSugerySchema);

// banco de urgencia
const urgencyBankModel = db.model("UrgencyBank", urgencyBankSchema);
const urgencyServiceModel = db.model('UrgencyService', urgencyService);
const patientHospitalizedModel = db.model("PatientHospitalized", patientHospitalizedSchema);
const prescriptionModel = db.model("Prescription", prescriptionSchema);
const surgeryModel = db.model("Surgery", surgerySchema);

//operating room
const operatingRoomModel = db.model("patietOperatingRoom", operatingRoomSchema);
const operatingRoomResultModel = db.model("operatingRoomExternal", operatingRoomResultSchema);

//internamento
const bedNursingModel = db.model("bedNursing", bedNursingSchema);
const nursingModel = db.model("Nursing", nursingSchema);
const sectionModel = db.model("Section", sectionSchema);
const internalServiceModel = db.model("InternalService", internalServiceSchema);
const hospitalizationModel = db.model("Hospitalization", hospitalizationSchema);
const inHospitalizeModel = db.model("inHospitalize", inHospitalizeSchema);
const internalMovimentModel = db.model("InternalMoviments", internalMovimentsSchema);
const serviceRequestsModel = db.model("ServiceRequest", serviceRequestsSchema);
const namePatternsModel = db.model("NamePattern", namePatternsSchema);

//historico de altas
const dischargeHistoryModel = db.model("DischargeHistory", dischargeHistorySchema);

// morgue
const morgueChamberModel = db.model("MorgueChamber", morgueChamberSchema);
const morgueAccommodationModel = db.model("MorgueAccommodation", morgueAccommodationSchema);
const morgueExitModel = db.model("MorgueExit", morgueExitSchema);


export { namePatternsModel, dischargeHistoryModel }

export {
  userModel,
  patientStateModel,
  currentLocationModel,
  patientModel,
  demographyModel,
  patientSyncModel,
  responsibleModel,
  groupModel,
  accessTypeModel,
  screeningModel,
  triedModel,
  processStateModel,
  examGroupModel,
  unitModel,
  scheduleExamModel,
  examResultModel,
  examClassificationModel,
  serviceCategoryModel,
  examCancelModel,
  workplaceModel,
  doctorCalendarModel,
  scheduleAppointmentModel,
  appointmentCancelModel,
  specialtyModel,
  externalUnitModel,
  officeModel,
  scheduleServiceModel,
  serviceResultModel,
  externalResultsModel,
  urgencyBankModel,
  urgencyServiceModel,
  patientHospitalizedModel,
  prescriptionModel,
  surgeryModel,
  internalExamResultModel,
  scheduleSugeryModel,
  operatingRoomModel,
  operatingRoomResultModel,
  deceasedPatientModel,
  morgueChamberModel,
  morgueAccommodationModel,
  morgueExitModel,
};

export {
  bedNursingModel,
  nursingModel,
  sectionModel,
  internalServiceModel,
  hospitalizationModel,
  inHospitalizeModel,
  internalMovimentModel,
  serviceRequestsModel,
  serviceModel,
  patientExitModel,
  patientWaitingModel
};
