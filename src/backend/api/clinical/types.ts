import { Types } from "mongoose";

export type clinicalOptions = {
  _id: Types.ObjectId;
  label: string;
};

type Responsable = {
  name: string;
  kinship: string;
  tel: string;
};

type Responsables = {
  patientId?: string;
  responsibles: [
    Responsable,
    Responsable
  ];
};

type responsibleProps = {
  responsibles: [
    Responsable,
    Responsable
  ];
};

type Assured = {
  name: string;
  apolice: number;
  tel: string;
  detail: string;
};

type Enterprise = {
  name: string;
  passNumber: string;
  role: string;
};

type Employee = {
  passNumber: string;
  role: string;
  workArea: string;
};

type Group = {
  patientId: string;
  type: string,
  group: Assured | Enterprise | Employee
};

type groupProps = {
  type: string,
  group: Assured | Enterprise | Employee
};

type accessProps = {
  type: string;
  hospital?: string;
  street?: string;
  municipality?: string;
  province?: string;
};

type AccessType = {
  patientId: string;
  type: string;
  hospital?: unknown;
};

type GETpatient = {
  createdAt: Date;
  registerNumber: number;
  fullname: string;
  group: string;
  accessType: string;
  id: string;
  priorityType?: string;
};

type Patient = {
  fullname: string;
  birthDate?: Date;
  age?: string;
  civilState?: string;
  gender?: string;
  tel?: string;
  documentation: string;
  lang?: string;
  registerNumber?: string;
};

type patientProps = {
  fullname: string;
  birthDate: string;
  age: string;
  civilState: string;
  gender: string;
  tel: string;
  documentation: string;
  lang?: string;
};

type Demography = {
  nationality?: string,
  naturality?: string,
  province?: string,
  actualLocation: string,
  street?: string
  homeNumber?: string
}

type ServiceType = "paediatrics" | "surgery" | "medicine";

// triagem

type VitalSignalType = {
  paMax: string,
  paMin: string,
  jump: string,
  pvc: string,
  imc: string,
  sp02: string,
  temperature: string,
  breathing: string,
  weight: string,
  height: string,
  bloodGlucose: string
};

type DoctorCalendar = {
  doctorId: string;
  initialTime: string;
  finalTime: string;
  room: string;
  day: string;
};

type Calendar = {
  doctorId: string;
  initialTime: string ;
  finalTime: string;
  room: string;
  day: Date;
  availableDoctorSpace: {
    spaces: number;
  };
};

type DoctorCalendarReference = {
  _id: string;
  label: string;
  calendar: Calendar;
};

type DoctorDayAndTime = {
  startAt: string; 
  endAt: string; 
  day: Date;
  availableDoctorSpace: {
    spaces: number;
  };
};

export interface PatientHistory {
  internalServiceId: string;
  patientId: string;
  examsQuantity: number;
  updatedAt: Date;
}

export interface ListPatient<T>{
  patients: T[];
  totalItems: number;
  availablePages: number;
  currentPage: number;
}

type diariesProps = {
  _id: string,
  date: string,
  description: string,
  signature?: string,
  vitalSignals?: {
    paMax: number,
    paMin: number,
    jump: number,
    pvc: number,
    imc: number,
    spO2: number,
    temperature: number,
    breathing: number,
    weight: number,
    height: number,
    bloodGlucose: number,
  }
  siteOfDrugAdministration?: string,
  amount?: string,
  hidromineralBalance?: string,
}

type diaryTypeProps = {
  medicineDiary?: {
    _id: string,
    date: string,
    description: string,
  }[],
  nursingNotes?: {
    _id: string,
    date: string,
    description: string,
  }[], 
  therapeuticDiary?:{
    _id: string,
    date: string,
    signature: string,
    description:string,
  }[],
  treatmentDiary?:{
    _id: string,
    date: string,
    signature: string,
    description:string,
  }[],
  vitalSignals?:{
    _id: string,
    date: string,  
    description: string,
    vitalSignals: {
      paMax: number,
      paMin: number,
      jump: number,
      pvc: number,
      imc: number,
      spO2: number,
      temperature: number,
      breathing: number,
      weight: number,
      height: number,
      bloodGlucose: number,
    }
  }[],
  hydromineralBalance?: {
    _id: string,
    date: string,
    siteOfDrugAdministration: string,
    amount: string,
    hidromineralBalance: string,
    description: string,
  }[],  
}

export type {
  Responsable,
  Responsables,
  Group,
  Employee,
  Enterprise,
  Assured,
  AccessType,
  GETpatient,
  Patient,
  Demography,
  ServiceType,
  VitalSignalType,
  DoctorCalendar,
  groupProps,
  accessProps,
  responsibleProps,
  patientProps,
  Calendar,
  DoctorCalendarReference,
  DoctorDayAndTime,
  diariesProps,
  diaryTypeProps,
};