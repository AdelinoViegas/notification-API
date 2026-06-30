"use client";

import Button from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";

type GuideData = {
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

export default function AccommodationGuidePdf({
  data,
  onDone,
}: {
  data: GuideData;
  onDone: () => void;
}) {
  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <title>Guia de Acomodação — ${data.fullname}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A5; margin: 16mm; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11px;
            color: #222;
            padding: 12px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #374151;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .header h1 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #374151; }
          .header p { font-size: 10px; color: #666; margin-top: 3px; }
          .section { margin-bottom: 10px; }
          .section-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #374151;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 2px;
            margin-bottom: 7px;
            letter-spacing: 0.5px;
          }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 16px; }
          .field { margin-bottom: 4px; }
          .field-label { font-size: 9px; color: #6b7280; text-transform: uppercase; }
          .field-value { font-size: 11px; font-weight: 600; }
          .full { grid-column: 1 / -1; }
          .footer {
            margin-top: 18px;
            border-top: 1px solid #d1d5db;
            padding-top: 8px;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
          }
          .sig-area {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
          }
          .sig-box { width: 130px; text-align: center; }
          .sig-line { border-top: 1px solid #374151; margin-bottom: 3px; }
          .sig-label { font-size: 9px; color: #6b7280; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Guia de Acomodação de Utente</h1>
          <p>Morgue — Sistema Integrado de Gestão Clínica</p>
        </div>

        <div class="section">
          <div class="section-title">Dados do Falecido</div>
          <div class="grid">
            <div class="field full">
              <div class="field-label">Nome Completo</div>
              <div class="field-value">${data.fullname}</div>
            </div>
            <div class="field">
              <div class="field-label">Nº de Processo</div>
              <div class="field-value">${data.processNumber}</div>
            </div>
            <div class="field">
              <div class="field-label">Sexo</div>
              <div class="field-value">${data.gender}</div>
            </div>
            <div class="field">
              <div class="field-label">Serviço de Internamento</div>
              <div class="field-value">${data.service}</div>
            </div>
            <div class="field">
              <div class="field-label">Data/Hora Admissão</div>
              <div class="field-value">${data.admissionDate}</div>
            </div>
            <div class="field">
              <div class="field-label">Data/Hora do Óbito</div>
              <div class="field-value">${data.dateOfDeath}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Acomodação</div>
          <div class="grid">
            <div class="field">
              <div class="field-label">Câmara</div>
              <div class="field-value">${data.chamberName}</div>
            </div>
            <div class="field">
              <div class="field-label">Gaveta</div>
              <div class="field-value">${data.drawer}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Responsável pela Entrega</div>
          <div class="grid">
            <div class="field full">
              <div class="field-label">Nome</div>
              <div class="field-value">${data.responsibleName}</div>
            </div>
            <div class="field">
              <div class="field-label">Nº do BI</div>
              <div class="field-value">${data.responsibleBI}</div>
            </div>
            <div class="field">
              <div class="field-label">Contacto</div>
              <div class="field-value">${data.responsibleContact}</div>
            </div>
            <div class="field">
              <div class="field-label">Parentesco</div>
              <div class="field-value">${data.responsibleKinship}</div>
            </div>
          </div>
        </div>

        <div class="sig-area">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Responsável pela Entrega</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Funcionário da Morgue</div>
          </div>
        </div>

        <div class="footer">
          Emitido em: ${data.issuedAt} &nbsp;|&nbsp; Doc. Nº: ${data.accommodationId.slice(-8).toUpperCase()}
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
        ✓ Utente acomodado com sucesso. Gere a guia de acomodação antes de sair.
      </p>

      <div className="flex gap-3">
        <Button type="button" onClick={handlePrint} className="flex items-center gap-2">
          <FaFilePdf className="size-4" />
          Gerar Guia de Acomodação (A5)
        </Button>
        <Button type="button" cancel onClick={onDone}>
          Concluir sem imprimir
        </Button>
      </div>
    </div>
  );
}
