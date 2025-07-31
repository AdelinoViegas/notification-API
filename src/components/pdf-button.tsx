"use client";

import Button from "./ui/button";
import { appointmentRecord, patientRecord, screeningRecord } from "@/lib/handle-pdf";
import { 
  Patient as Personal,
  Demography,
  VitalSignalType,
  Responsable,
  Assured,
  Employee,
  Enterprise,
  accessProps,
} from "@/app/backend/api/clinical/types";
import { FaFilePdf } from "react-icons/fa";

export type Group = {
  type: string;
  group?: Assured | Employee | Enterprise
}

export type PatientRecord = {
  personal: Personal;
  demography: Demography;
  responsibles: Responsable[];
  groupType?: {
    type: string,
    group: Assured | Employee | Enterprise | undefined
  };
  acess?: accessProps;
  group: string;
};

export type ScreeningRecord = {
  reason: string,
  vitalsSignal: VitalSignalType,
  status: string,
  advice: string,
};

export type AppointmentRecord = {
  patientName: string,
  age: number,
  gender: string,
  date: string,
  hour: string,
  consultationType: string,
  consultationPrice: number,
}

export type Arguments = PatientRecord | ScreeningRecord | AppointmentRecord;

export default function PDFButton({
  label,
  args,
  type
}: {
  label: string;
  args: Arguments;
  type: "patientRecord" | "screeningRecord" | "appointmentRecord";
}){ 
  switch(type){
    case "patientRecord":
      return (
        <Button className="flex gap-x-2" onClick={()=>patientRecord(args as PatientRecord)}>
          <FaFilePdf className="size-5"/>
          {label}
        </Button>
      );
    case "screeningRecord": 
      return (
        <Button onClick={()=>screeningRecord(args as ScreeningRecord)}>{label}</Button>
      );
    case "appointmentRecord": 
      return (
        <Button className="flex gap-x-2"  onClick={()=>appointmentRecord(args as AppointmentRecord)}>
          <FaFilePdf className="size-5"/>
          {label}
        </Button>
      );
  }
}