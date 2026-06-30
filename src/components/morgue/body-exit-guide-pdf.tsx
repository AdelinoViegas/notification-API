"use client";

import Button from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";

type ExitData = {
  fullname: string;
  processNumber: string;
  gender: string;
  age: string;
  dateOfDeath: string;
  responsibleEntry: string;
  responsibleEntryContact: string;
  responsibleEntryKinship: string;
  chamberName: string;
  drawer: string;
  responsibleExitName: string;
  responsibleExitBI: string;
  responsibleExitContact: string;
  responsibleExitKinship: string;
  transportType: string;
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

const check = (val: boolean) => (val ? "☑" : "☐");

export default function BodyExitGuidePdf({
  data,
  onDone,
}: {
  data: Record<string, unknown>;
  onDone: () => void;
}) {
  const d = data as ExitData;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const transportSection =
      d.transportType === "family"
        ? `<div class="grid">
            <div class="field full"><div class="field-label">Tipo de Transporte</div><div class="field-value">Família</div></div>
            <div class="field"><div class="field-label">Nome</div><div class="field-value">${d.transportFamilyName ?? "—"}</div></div>
            <div class="field"><div class="field-label">Parentesco</div><div class="field-value">${d.transportFamilyKinship ?? "—"}</div></div>
           </div>`
        : `<div class="grid">
            <div class="field full"><div class="field-label">Tipo de Transporte</div><div class="field-value">Agência Funerária</div></div>
            <div class="field"><div class="field-label">Nome da Agência</div><div class="field-value">${d.transportAgencyName ?? "—"}</div></div>
            <div class="field"><div class="field-label">Motorista</div><div class="field-value">${d.transportAgencyDriver ?? "—"}</div></div>
            <div class="field"><div class="field-label">Marca/Modelo</div><div class="field-value">${d.transportAgencyVehicleBrand ?? "—"}</div></div>
            <div class="field"><div class="field-label">Matrícula</div><div class="field-value">${d.transportAgencyLicensePlate ?? "—"}</div></div>
           </div>`;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <title>Guia de Saída de Corpo — ${d.fullname}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11.5px;
            color: #1f2937;
            padding: 12px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #1a56db;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }
          .header h1 { font-size: 18px; text-transform: uppercase; color: #1a56db; letter-spacing: 1px; }
          .header p { font-size: 11px; color: #6b7280; margin-top: 4px; }
          .section { margin-bottom: 16px; }
          .section-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #1a56db;
            border-bottom: 1px solid #dbeafe;
            padding-bottom: 3px;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
          .field { margin-bottom: 5px; }
          .field-label { font-size: 9.5px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; }
          .field-value { font-size: 12px; font-weight: 600; }
          .full { grid-column: 1 / -1; }
          .docs { display: flex; flex-direction: column; gap: 5px; }
          .doc-item { font-size: 11.5px; }
          .footer {
            margin-top: 32px;
            border-top: 1px solid #d1d5db;
            padding-top: 10px;
            font-size: 10px;
            color: #9ca3af;
            text-align: center;
          }
          .sig-area { display: flex; justify-content: space-between; margin-top: 36px; }
          .sig-box { width: 180px; text-align: center; }
          .sig-line { border-top: 1px solid #374151; margin-bottom: 4px; }
          .sig-label { font-size: 10px; color: #6b7280; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Guia de Saída de Corpo</h1>
          <p>Morgue — Sistema Integrado de Gestão Clínica</p>
        </div>

        <div class="section">
          <div class="section-title">a) Dados do Falecido</div>
          <div class="grid">
            <div class="field full">
              <div class="field-label">Nome Completo</div>
              <div class="field-value">${d.fullname}</div>
            </div>
            <div class="field"><div class="field-label">Sexo</div><div class="field-value">${d.gender}</div></div>
            <div class="field"><div class="field-label">Idade</div><div class="field-value">${d.age} anos</div></div>
            <div class="field"><div class="field-label">Nº de Processo</div><div class="field-value">${d.processNumber}</div></div>
            <div class="field"><div class="field-label">Data/Hora do Óbito</div><div class="field-value">${d.dateOfDeath}</div></div>
            <div class="field"><div class="field-label">Responsável pela Entrada</div><div class="field-value">${d.responsibleEntry}</div></div>
            <div class="field"><div class="field-label">Contacto</div><div class="field-value">${d.responsibleEntryContact}</div></div>
            <div class="field"><div class="field-label">Câmara / Gaveta</div><div class="field-value">${d.chamberName} / ${d.drawer}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">b) Responsável pela Saída do Corpo</div>
          <div class="grid">
            <div class="field full"><div class="field-label">Nome</div><div class="field-value">${d.responsibleExitName}</div></div>
            <div class="field"><div class="field-label">Nº do BI</div><div class="field-value">${d.responsibleExitBI}</div></div>
            <div class="field"><div class="field-label">Contacto</div><div class="field-value">${d.responsibleExitContact}</div></div>
            <div class="field"><div class="field-label">Parentesco</div><div class="field-value">${d.responsibleExitKinship}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">c) Transportador</div>
          ${transportSection}
        </div>

        <div class="section">
          <div class="section-title">d) Documentos Verificados</div>
          <div class="docs">
            <div class="doc-item">${check(d.docDeathCertificate)} Certificado de Óbito</div>
            <div class="doc-item">${check(d.docFamilyAuthorization)} Autorização da Família</div>
            <div class="doc-item">${check(d.docAgencyTransportGuide)} Guia de Transporte da Agência</div>
            <div class="doc-item">${check(d.docJudicialAuthorization)} Autorização Judicial</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">e) Destino</div>
          <div class="field-value">${d.destination}</div>
        </div>

        <div class="sig-area">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Responsável pela Saída</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Funcionário da Morgue</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Director Clínico</div>
          </div>
        </div>

        <div class="footer">
          Emitido em: ${d.issuedAt}
        </div>

        <script>window.onload = () => { window.print(); }<\/script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-4 py-4">
      <p className="text-sm text-green-700 font-medium">
        ✓ Saída do corpo registada com sucesso. Gere a guia antes de sair.
      </p>

      <div className="flex gap-3">
        <Button type="button" onClick={handlePrint} className="flex items-center gap-2">
          <FaFilePdf className="size-4" />
          Gerar Guia de Saída de Corpo (A4)
        </Button>
        <Button type="button" cancel onClick={onDone}>
          Concluir sem imprimir
        </Button>
      </div>
    </div>
  );
}
