import type { Template } from '@pdfme/common';
import _patientPlug from "./templates/patient-plug.json";
import _appointmentPlug from "./templates/appointment-plug.json";
import _examPlug from "./templates/exam-plug.json";
import _screeningPlug from "./templates/screening-plug.json";
import _morgueAccommodationPlug from "./templates/morgue-accommodation-plug.json";
import _morgueExitPlug from "./templates/morgue-exit-plug.json";

export const patientPlug = _patientPlug as Template;
export const appointmentPlug = _appointmentPlug as Template;
export const examPlug = _examPlug as Template;
export const screeningPlug = _screeningPlug as Template;
export const morgueAccommodationPlug = _morgueAccommodationPlug as unknown as Template;
export const morgueExitPlug = _morgueExitPlug as unknown as Template;

export function browserPdf(data: unknown){
  const blob = new Blob([data as BlobPart], { type: "application/pdf" });
  window.open(URL.createObjectURL(blob));
}

/**
 * Gera o download do PDF com um nome de ficheiro específico
 * (ex: "Guia de Acomodação - João Manuel.pdf"), em vez de abrir
 * apenas numa nova aba com um nome aleatório.
 */
export function downloadPdf(data: unknown, filename: string){
  const blob = new Blob([data as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
