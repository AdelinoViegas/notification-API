"use client";

import Button from "./ui/button";
import { patientRecord, screeningRecord } from "@/lib/handle-pdf";
import { 
  Patient as Personal,
  Demography,
  VitalSignalType,
} from "@/app/backend/api/clinical/types";

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

export type Arguments = PatientRecord | ScreeningRecord;

export default function PDFButton({
  label,
  args,
  type
}: {
  label: string;
  args: Arguments;
  type: "patientRecord" | "screeningRecord";
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
  }
}