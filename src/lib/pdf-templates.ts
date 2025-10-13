import type { Template } from '@pdfme/common';
import _patientPlug from "./templates/patient-plug.json";

export const patientPlug = _patientPlug as Template

export function browserPdf(data: unknown){
  const blob = new Blob([data as BlobPart], { type: "application/pdf" });
  window.open(URL.createObjectURL(blob))
}
