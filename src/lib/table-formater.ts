import { GETpatient } from "@/backend/api/clinical/types";
import { getDataAndHoursFormat, getDateInSlashFormat } from "@/lib/date-formater";

export type TableRow = {
  id: string;
  row: string[]
};

export type PatientExam = {
  _id: string;
  examCode: string;
  name: string;
  category: string;
  classification: string;
  group: string;
  price: string;
};

export type ScheduleExam = {
  id: string;
  createAt: Date;
  patientName: string;
  laboratory: string;
  examQty: number;
  user: string;
  status:string;
};

export type ScheduleAppointment = {
  id: string;
  hour: string;
  patient: string;
  doctor: string;
  room: string;
  status: string;
};

export type ScheduleSugery = {
  id: string;
  date: string;
  doctor: string;
  patient: string;
  sugeryType: string;
  requestingService: string;
  infirmary: string;
  bed: string;
  status?: string;
};

export type DoctorOffice = {
  id: string;
  markedDatatime: string;
  patient: string;
  user: string;
  room: string;
};

export type PhisicalUnit = {
  id: string;
  createAt: Date;
  unitName: string;
  type: string;
  user: string;
  status: string;
};

export type ExternalUnit = {
  id: string;
  name: string;
  street: string;
  municipality: string;
  province: string;
  user: string;
};

export type ClinicalUser = {
  id: string;
  createdAt: Date;
  fullname: string;
  category: string;
  role: string;
  workplaces: number;
};

export type User = {
  id: string;
  createAt: Date;
  fullname: string;
  username: string;
  tel: string;
  email: string;
  group: string;
  status: string;
};

export type Calendar = {
  id: string;
  description: string;
  monthName: string;
  creator: string;
  createdAt: Date;
};

export type Consultation = {
  id: string;
  code: string;
  name: string;
  price: number;
};

export type Services = {
  id: string,
  patient: string,
  markedDatatime: string,
  user: string
  nameLaboratory: string 
};

type TempResult = {
  _id: string;
  plainText: string;
  createdAt: Date;
  file: {
    name: string;
    size: number;
    link: string;
  };
  name: string;
};

export function angolaCurrency(money: number | string){
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(
    money as number,
  );
}

export function tablePatientExam(exam: PatientExam[]){
  const tableRows:TableRow[] = [];
  for(const data of exam)
    tableRows.push({
      id: data._id,
      row: [
        data.examCode,
        data.name,
        data.category,
        data.classification,
        data.group,
        angolaCurrency(data.price),
      ],
    });

  return tableRows;
}

export function tablePhisicalUnit(unit: PhisicalUnit[]){
  const tableRows:TableRow[] = [];
  for(const data of unit)
    tableRows.push({
      id: data.id,
      row: [
        getDateInSlashFormat(data.createAt),
        data.unitName,
        data.type,
        data.user,
        data.status,
      ],
    });

  return tableRows;
} 

export function tableCalendar(calendarData: Calendar[]){
  const tableRows:TableRow[] = [];
  for(const data of calendarData)
    tableRows.push({
      id: data.id,
      row: [
        getDateInSlashFormat(data.createdAt),
        data.description,
        data.monthName.toUpperCase(),
        data.creator,
      ],
    });

  return tableRows;
}

export function tableScheduleExam(schedule: ScheduleExam[]){
  const tableRows:TableRow[] = [];
  for(const data of schedule)
    tableRows.push({
      id: data.id,
      row: [
        getDataAndHoursFormat(data.createAt),
        data.patientName,
        data.laboratory,
        String(data.examQty),
        data.user,
        data.status,
      ],
    });

  return tableRows;
}

export function tableUser(user: User[]){
  const tableRows:TableRow[] = [];
  for(const data of user)
    tableRows.push({
      id: data.id,
      row: [
        getDateInSlashFormat(data.createAt),
        data.fullname,
        data.username,
        data.tel,
        data.email,
        data.group,
        data.status,
      ],
    });

  return tableRows;
}

export function tableClinicalUser(clinical: ClinicalUser[]){
  const tableRows:TableRow[] = [];
  for(const data of clinical)
    tableRows.push({
      id: data.id,
      row: [
        getDateInSlashFormat(data.createdAt),
        data.fullname,
        data.category,
        data.role,
        String(data.workplaces),
      ],
    });

  return tableRows;
}

export function tablePatient(patient: GETpatient[]){
  const tableRows:TableRow[] = [];
  for(const data of patient)
    tableRows.push({
      id: data.id,
      row: !!data?.priorityType?
      [
        data.priorityType as string,
        getDateInSlashFormat(data.createdAt),
        String(data.registerNumber),
        data.fullname,
        data.group,
        data.accessType
      ]:
      [
        getDateInSlashFormat(data.createdAt),
        String(data.registerNumber),
        data.fullname,
        data.group,
        data.accessType
      ]
    });

  return tableRows;
}

export function simpleFormater(rows: { id: string; name: string }[]){
  const tableRows:TableRow[] = [];
  for(const item of rows)
    tableRows.push({
      id: item.id,
      row: [ item.name ]
    });

  return tableRows;
}

export function tableAppointments(appointments: ScheduleAppointment[]){
  const tableRows:TableRow[] = [];
  for(const item of appointments)
    tableRows.push({
      id: item.id,
      row: [ 
        item.hour,
        item.patient,
        item.doctor,
        item.room,
        item.status,
      ]
    });

  return tableRows;
}

export function tableSugeries(sugeries: ScheduleSugery[]){
  const tableRows:TableRow[] = [];
  for(const item of sugeries)
    tableRows.push({
      id: item.id,
      row: [
        item.requestingService,
        item.date, 
        item.patient,
        item.sugeryType,
        item.infirmary,
        item.bed,
        item.doctor,
        item?.status as string,
      ]
    });

  return tableRows;
}

export function tableOperatingRoom(sugeries: ScheduleSugery[]){
  const tableRows:TableRow[] = [];
  for(const item of sugeries)
    tableRows.push({
      id: item.id,
      row: [
        item.requestingService,
        item.date, 
        item.patient,
        item.sugeryType,
        item.infirmary,
        item.bed,
        item.doctor,
      ]
    });

  return tableRows;
}

export function tableLaboratory(laboratory: Services[]){
  const tableRows:TableRow[] = [];
  for(const item of laboratory)
    tableRows.push({
      id: item.id,
      row: [ 
        item.markedDatatime,
        item.patient,
        item.user,
        item.nameLaboratory,
      ]
    });

  return tableRows;
}

export function tableExternalUnit(appointments: ExternalUnit[]){
  const tableRows:TableRow[] = [];
  for(const item of appointments)
    tableRows.push({
      id: item.id,
      row: [ 
        item.name,
        item.street,
        item.municipality,
        item.province,
        item.user
      ]
    });

  return tableRows;
}

export function tableOffice(data: DoctorOffice[]){
  const tableRows:TableRow[] = [];
  for(const item of data)
    tableRows.push({
      id: item.id,
      row: [ 
        item.markedDatatime,
        item.patient,
        item.user,
        item.room,
      ]
    });

  return tableRows;
}

export class TableFormatter{
  static tableRow:TableRow[] = [];

  static urgencyExamResults(data: TempResult[]){
    this.tableRow = [];
    for(const props of data)
      this.tableRow.push({
        id: props._id,
        row: [
          getDataAndHoursFormat(props.createdAt),
          props.name,
          props.plainText?props.plainText:"Sem Descrição",
          props.file.size?props.file.name:"Sem Arquivo"
        ]
      });

    return this.tableRow;
  }
}