"use client";

import Button from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";

type DischargeRecord = {
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
  statusLabel: string;
};

export default function ExportPdfButton({
  record,
}: {
  record: DischargeRecord;
}) {
  const handleExport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const admissionDate = new Date(record.admissionDate).toLocaleDateString("pt-AO");
    const dischargeDate = new Date(record.dischargeDate).toLocaleDateString("pt-AO");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório de Alta - ${record.patientName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 3px solid #1a56db; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { font-size: 20px; color: #1a56db; text-transform: uppercase; letter-spacing: 1px; }
          .header p { font-size: 12px; color: #666; margin-top: 4px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 14px; font-weight: 700; color: #1a56db; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
          .field { margin-bottom: 8px; }
          .field-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
          .field-value { font-size: 14px; font-weight: 500; margin-top: 2px; }
          .full-width { grid-column: 1 / -1; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; }
          .status-locked { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 16px; text-align: center; font-size: 11px; color: #999; }
          .signature-area { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature-line { width: 200px; text-align: center; }
          .signature-line hr { border: none; border-top: 1px solid #333; margin-bottom: 4px; }
          .signature-line span { font-size: 12px; color: #666; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Alta Hospitalar</h1>
          <p>Documento gerado automaticamente pelo sistema clínico</p>
        </div>

        <div class="section">
          <div class="section-title">Dados do Paciente</div>
          <div class="grid">
            <div class="field">
              <div class="field-label">Nome Completo</div>
              <div class="field-value">${record.patientName}</div>
            </div>
            <div class="field">
              <div class="field-label">Nº de Processo</div>
              <div class="field-value">${record.processNumber}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Dados do Internamento</div>
          <div class="grid">
            <div class="field">
              <div class="field-label">Serviço de Internamento</div>
              <div class="field-value">${record.internalServiceName}</div>
            </div>
            <div class="field">
              <div class="field-label">Enfermaria</div>
              <div class="field-value">${record.nursingName}</div>
            </div>
            <div class="field">
              <div class="field-label">Nº da Cama/Leito</div>
              <div class="field-value">${record.bedName}</div>
            </div>
            <div class="field">
              <div class="field-label">Data de Admissão</div>
              <div class="field-value">${admissionDate}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Dados da Alta</div>
          <div class="grid">
            <div class="field">
              <div class="field-label">Data da Alta</div>
              <div class="field-value">${dischargeDate}</div>
            </div>
            <div class="field">
              <div class="field-label">Tipo de Alta</div>
              <div class="field-value">${record.dischargeTypeLabel}</div>
            </div>
            <div class="field">
              <div class="field-label">Médico Responsável</div>
              <div class="field-value">${record.doctorName}</div>
            </div>
            <div class="field">
              <div class="field-label">Estado</div>
              <div class="field-value">
                <span class="status-badge ${record.statusLabel === "Bloqueado" ? "status-locked" : ""}">${record.statusLabel}</span>
              </div>
            </div>
            <div class="field full-width">
              <div class="field-label">Diagnóstico de Admissão</div>
              <div class="field-value">${record.admissionDiagnosis}</div>
            </div>
          </div>
        </div>

        <div class="signature-area">
          <div class="signature-line">
            <hr />
            <span>Médico Responsável</span>
          </div>
          <div class="signature-line">
            <hr />
            <span>Director Clínico</span>
          </div>
        </div>

        <div class="footer">
          <p>Documento emitido em ${new Date().toLocaleDateString("pt-AO")} às ${new Date().toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Button type="button" className="flex gap-x-2" onClick={handleExport}>
      <FaFilePdf className="size-5" />
      Exportar PDF
    </Button>
  );
}
