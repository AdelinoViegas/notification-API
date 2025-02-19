import { clinical } from "@/app/backend/models/con";
import { 
  userSchema, 
  currentLocationSchema, 
  notificationSchema
} from "@/app/backend/schemas/clinical/user";
import { 
  examSchema, 
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
} from "@/app/backend/schemas/clinical/scheduling";
import { 
  responsibleSchema,
  accesTypeSchema, 
  groupSchema, 
  patientSchema,
  demographySchema,
  processStateSchema,
  specialtyStateSchema
} from "@/app/backend/schemas/clinical/patient";
import { 
  screeningSchema,
  triedSchema
} from "@/app/backend/schemas/clinical/screening";
import { 
  unitSchema, 
  workplaceSchema,
  externalUnitSchema, 
  scheduleServiceSchema,
  serviceResultSchema,
  externalResultSchema
} from "@/app/backend/schemas/clinical/unit";
import { 
  urgencyBankSchema, 
  urgencyService 
} from "@/app/backend/schemas/clinical/urgency-bank";

const userModel = clinical.model('User', userSchema);
const currentLocationModel = clinical.model("CurrentLocation", currentLocationSchema);
// patient
const patientModel = clinical.model('Patient', patientSchema);
const demographyModel = clinical.model('Demography', demographySchema);
const responsibleModel = clinical.model('Responsible', responsibleSchema);
const groupModel = clinical.model('PatientGroup', groupSchema);
const accessTypeModel = clinical.model('AcessType', accesTypeSchema);
const screeningModel = clinical.model('Screening', screeningSchema);
const processStateModel = clinical.model("ProcessState", processStateSchema);

// screening...
const triedModel = clinical.model("Tried", triedSchema);

//scheduling
const examModel = clinical.model("ExamService", examSchema);
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
const notificationModel = clinical.model("Notification", notificationSchema);
const serviceResultModel = clinical.model("ServiceResult", serviceResultSchema);
const externalResultsModel = clinical.model('ExternalResults', externalResultSchema);

//urgency-bank
const urgencyBankModel = clinical.model("UrgencyBank", urgencyBankSchema);
const urgencyServiceModel = clinical.model('UrgencyService', urgencyService);

export {
  userModel,
  currentLocationModel,
  patientModel,
  demographyModel,
  responsibleModel,
  groupModel,
  accessTypeModel,
  screeningModel,
  triedModel,
  processStateModel,
  examModel,
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
  notificationModel,
  serviceResultModel,
  externalResultsModel,
  urgencyBankModel,
  urgencyServiceModel
};