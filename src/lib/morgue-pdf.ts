import { generate } from "@pdfme/generator";
import { image, rectangle, text, barcodes, line } from "@pdfme/schemas";
import { morgueAccommodationPlug, morgueExitPlug, downloadPdf } from "@/lib/pdf-templates";

const plugins = {
  rectangle,
  text,
  image,
  qrcode: barcodes.qrcode,
  line,
};

// ── Types ────────────────────────────────────────────────────────────────────

export type AccommodationGuideData = {
  accommodationId: string;
  fullname: string;
  processNumber: string;
  gender: string;
  service: string;
  admissionDate: string;
  dateOfDeath: string;
  chamberName: string;
  drawer: string;
  responsibleName: string;
  responsibleBI: string;
  responsibleContact: string;
  responsibleKinship: string;
  issuedAt: string;
};

export type BodyExitGuideData = {
  fullname: string;
  processNumber: string;
  gender: string;
  age: string;
  dateOfDeath: string;
  responsibleEntry: string;
  responsibleEntryContact: string;
  chamberName: string;
  drawer: string;
  responsibleExitName: string;
  responsibleExitBI: string;
  responsibleExitContact: string;
  responsibleExitKinship: string;
  transportType: "family" | "funeral_agency";
  transportFamilyName?: string;
  transportFamilyKinship?: string;
  transportAgencyName?: string;
  transportAgencyDriver?: string;
  transportAgencyVehicleBrand?: string;
  transportAgencyLicensePlate?: string;
  docDeathCertificate: boolean;
  docFamilyAuthorization: boolean;
  docAgencyTransportGuide: boolean;
  docJudicialAuthorization: boolean;
  destination: string;
  issuedAt: string;
};

/** Remove caracteres inválidos para nomes de ficheiro, mantendo espaços e acentos */
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "").trim();
}

// ── Guia de Acomodação (A5) ───────────────────────────────────────────────────

export async function generateAccommodationGuide(data: AccommodationGuideData) {
  const docNumber = data.accommodationId.slice(-8).toUpperCase();

  const pdf = await generate({
    template: morgueAccommodationPlug,
    inputs: [
      {
        fullname: data.fullname,
        processNumber: data.processNumber,
        gender: data.gender,
        service: data.service,
        admissionDate: data.admissionDate,
        dateOfDeath: data.dateOfDeath,
        chamberName: data.chamberName,
        drawer: data.drawer,
        responsibleName: data.responsibleName,
        responsibleBI: data.responsibleBI,
        responsibleContact: data.responsibleContact,
        responsibleKinship: data.responsibleKinship,
        issuedAtLine: `Emitido em: ${data.issuedAt} | Doc. Nº: ${docNumber}`,
      },
    ],
    plugins,
  });

  downloadPdf(pdf, `Guia de Acomodação - ${sanitizeFilename(data.fullname)}.pdf`);
}

// ── Guia de Saída de Corpo (A4) ───────────────────────────────────────────────

function docLine(checked: boolean, label: string) {
  return `${checked ? "☑" : "☐"}  ${label}`;
}

export async function generateBodyExitGuide(data: BodyExitGuideData) {
  const isFamily = data.transportType === "family";

  const pdf = await generate({
    template: morgueExitPlug,
    inputs: [
      {
        fullname: data.fullname,
        gender: data.gender,
        age: `${data.age} anos`,
        processNumber: data.processNumber,
        dateOfDeath: data.dateOfDeath,
        responsibleEntry: data.responsibleEntry,
        responsibleEntryContact: data.responsibleEntryContact,
        chamberDrawer: `${data.chamberName} / ${data.drawer}`,

        responsibleExitName: data.responsibleExitName,
        responsibleExitBI: data.responsibleExitBI,
        responsibleExitContact: data.responsibleExitContact,
        responsibleExitKinship: data.responsibleExitKinship,

        transportTypeLabel: isFamily ? "Família" : "Agência Funerária",

        transportFamilyName:    isFamily ? (data.transportFamilyName ?? "—")    : "—",
        transportFamilyKinship: isFamily ? (data.transportFamilyKinship ?? "—") : "—",

        transportAgencyName:         !isFamily ? (data.transportAgencyName ?? "—")         : "—",
        transportAgencyDriver:       !isFamily ? (data.transportAgencyDriver ?? "—")       : "—",
        transportAgencyVehicleBrand: !isFamily ? (data.transportAgencyVehicleBrand ?? "—") : "—",
        transportAgencyLicensePlate: !isFamily ? (data.transportAgencyLicensePlate ?? "—") : "—",

        docDeathCertificate:      docLine(data.docDeathCertificate,      "Certificado de Óbito"),
        docFamilyAuthorization:   docLine(data.docFamilyAuthorization,   "Autorização da Família"),
        docAgencyTransportGuide:  docLine(data.docAgencyTransportGuide,  "Guia de Transporte da Agência"),
        docJudicialAuthorization: docLine(data.docJudicialAuthorization, "Autorização Judicial"),

        destination: data.destination,
        issuedAtLine: `Emitido em: ${data.issuedAt}`,
      },
    ],
    plugins,
  });

  downloadPdf(pdf, `Guia de Saída de Corpo - ${sanitizeFilename(data.fullname)}.pdf`);
}
