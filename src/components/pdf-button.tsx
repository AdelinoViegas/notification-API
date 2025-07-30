"use client";

import Button from "./ui/button";
import { appointmentRecord, patientRecord, screeningRecord } from "@/lib/handle-pdf";
import { 
  Patient as Personal,
  Demography,
  VitalSignalType,
} from "@/app/backend/api/clinical/types";
import { FaFilePdf } from "react-icons/fa";

export type PatientRecord = {
  personal: Personal;
  demography: Demography;
  // responsibles: Responsable[];
  // group: Assured | Employee | Enterprise;
};

export type ScreeningRecord = {
  reason:string,
  vitalsSignal:VitalSignalType,
  status:string,
  advice:string,
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
        <Button onClick={()=>patientRecord(args as PatientRecord)}>{label}</Button>
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