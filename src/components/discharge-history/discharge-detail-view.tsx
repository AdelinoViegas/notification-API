"use client";

import Tag from "@/components/ui/tag";
//import ExportPdfButton from "@/components/discharge-history/export-pdf-button";
import clsx from "clsx";

type DischargeRecord = {
  id: string;
  patientId: string;
  processNumber: number;
  patientName: string;
  internalServiceName: string;
  nursingName: string;
  bedName: string;
  admissionDate: Date;
  dischargeDate: Date;
  dischargeType: string;
  dischargeTypeLabel: string;
  admissionDiagnosis: string;
  doctorName: string;
  doctorId: string;
  status: string;
  statusLabel: string;
  createdAt: Date;
};

export function Field({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={clsx({ "col-span-2": fullWidth })}>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <p className="mt-1 text-sm font-medium text-gray-900 bg-gray-50 border rounded-md px-3 py-2">
        {value || "N/D"}
      </p>
    </div>
  );
}

export default function DischargeDetailView({
  record,
}: {
  record: DischargeRecord;
}) {
  const admissionDate = new Date(record.admissionDate).toLocaleDateString(
    "pt-AO",
    { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
  );
  const dischargeDate = new Date(record.dischargeDate).toLocaleDateString(
    "pt-AO",
    { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
  );

  return (
    <div className="space-y-4">
      {/* Dados do Internamento */}
      <div>
        <Tag className="inline-flex my-4">Dados do Internamento</Tag>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Serviço de Internamento" value={record.internalServiceName} />
          <Field label="Enfermaria" value={record.nursingName} />
          <Field label="Nº da Cama/Leito" value={record.bedName} />
          <Field label="Data de Admissão" value={admissionDate} />
        </div>
      </div>

      {/* Dados da Alta */}
      <div>
        <Tag className="inline-flex my-4">Dados da Alta</Tag>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data da Alta" value={dischargeDate} />
          <Field label="Tipo de Alta" value={record.dischargeTypeLabel} />
          <Field label="Médico Responsável" value={record.doctorName} />
          <Field
            label="Diagnóstico de Admissão"
            value={record.admissionDiagnosis}
            fullWidth
          />
        </div>
      </div>

      {/* Aviso read-only 
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
        <svg className="size-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Processo bloqueado — Modo somente leitura. Não é possível editar registos de altas.
      </div>*/}
    </div>
  );
}
