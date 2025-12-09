import { createConnection } from "mongoose";
import { 
  userSchema, 
  currentLocationSchema
} from "@/backend/schemas/user";
import { 
  examGroupSchema,
  scheduleExamSchema,
  examResultSchema,
  examCategorySchema,
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
  patientExitSchema
} from "@/backend/schemas/patient";
import { 
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
  nursingSchema, 
  sectionSchema 
} from "@/backend/schemas/hospitalization";
import { operatingRoomResultSchema, operatingRoomSchema } from "@/backend/schemas/opetating-room";

const clinical = createConnection(process.env.MONGO_URL as string, {
  dbName: process.env.MONGO_DB_NAME,
  family: 4,
  appName: "master-clinical"
});

const userModel = clinical.model('User', userSchema);
const currentLocationModel = clinical.model("CurrentLocation", currentLocationSchema);
// patient
const patientModel = clinical.model('Patient', patientSchema);
const demographyModel = clinical.model('Demography', demographySchema);
const responsibleModel = clinical.model('Responsible', responsibleSchema);
const groupModel = clinical.model('PatientGroup', groupSchema);
const accessTypeModel = clinical.model('AcessType', accessTypeSchema);
const screeningModel = clinical.model('Screening', screeningSchema);
const processStateModel = clinical.model("ProcessState", processStateSchema);
const patientSyncModel = clinical.model("PatientSyncs", patientSyncSchema);
const triedModel = clinical.model("Tried", triedSchema);
const patientStateModel = clinical.model("PatientState", patientStateSchema);
const patientExitModel = clinical.model("PatientExit", patientExitSchema);

//agendamentos (schedulings)

const serviceModel = clinical.model("Service", serviceSchema);
const examGroupModel = clinical.model("ExamGroup", examGroupSchema);
const examCategoryModel = clinical.model('ExamCategory', examCategorySchema);
const examClassificationModel = clinical.model('ExamClassification', examClassificationSchema);
const scheduleExamModel = clinical.model("ScheduleExam", scheduleExamSchema);
const unitModel = clinical.model("Unit", unitSchema);
const examResultModel = clinical.model("ExameResult", examResultSchema)
const examCancelModel = clinical.model("ExamCancel", examCancelSchema);
const appointmentCancelModel = clinical.model("AppointmentCancel", appointmentCancelSchema);
const workplaceModel = clinical.model("WorkPlace", workplaceSchema);
const doctorCalendarModel = clinical.model("DoctorCalendar", doctorCalendarSchema);
const scheduleAppointmentModel = clinical.model("ScheduleAppointment", scheduleAppointmentSchema);
const specialtyModel = clinical.model("Expeciality",specialtyStateSchema);
const externalUnitModel = clinical.model('ExternalUnit', externalUnitSchema);
const officeModel = clinical.model('Office', officeSchema);
const scheduleServiceModel = clinical.model("Services", scheduleServiceSchema);
const serviceResultModel = clinical.model("ServiceResult", serviceResultSchema);
const externalResultsModel = clinical.model('ExternalResults', externalResultSchema);
const internalExamResultModel = clinical.model("InternalExamResult", internalExamResultSchema);
const scheduleSugeryModel = clinical.model("ScheduleSugery", scheduleSugerySchema);

// banco de urgencia
const urgencyBankModel = clinical.model("UrgencyBank", urgencyBankSchema);
const urgencyServiceModel = clinical.model('UrgencyService', urgencyService);
const patientHospitalizedModel = clinical.model("PatientHospitalized", patientHospitalizedSchema);
const prescriptionModel = clinical.model("Prescription", prescriptionSchema);
const surgeryModel = clinical.model("Surgery", surgerySchema);

//operating room
const operatingRoomModel = clinical.model("patietOperatingRoom", operatingRoomSchema);
const operatingRoomResultModel = clinical.model("operatingRoomExternal", operatingRoomResultSchema);

//internamento
const bedNursingModel = clinical.model("bedNursing", bedNursingSchema);
const nursingModel = clinical.model("Nursing", nursingSchema);
const sectionModel = clinical.model("Section", sectionSchema);
const internalServiceModel = clinical.model("InternalService", internalServiceSchema);
const hospitalizationModel = clinical.model("Hospitalization", hospitalizationSchema);
const inHospitalizeModel = clinical.model("inHospitalize", inHospitalizeSchema);
const internalMovimentModel = clinical.model("InternalMoviments", internalMovimentsSchema);
const serviceRequestsModel = clinical.model("ServiceRequest", serviceRequestsSchema);

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
  examCategoryModel,
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
  serviceModel
};
