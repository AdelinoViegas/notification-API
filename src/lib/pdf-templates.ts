import type { Template } from '@pdfme/common';
import _patientPlug from "./templates/patient-plug.json";
import _appointmentPlug from "./templates/appointment-plug.json";

export const patientPlug = _patientPlug as Template;
export const appointmentPlug = _appointmentPlug as Template;

export function browserPdf(data: unknown){
  const blob = new Blob([data as BlobPart], { type: "application/pdf" });
  window.open(URL.createObjectURL(blob))
}