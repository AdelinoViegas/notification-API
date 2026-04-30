// FEEDBACK PHASE — remover após encerrar fase de testes
// Requer variável de ambiente: FEEDBACK_GOOGLE_SCRIPT_URL
//
// No Google Apps Script, criar um projeto com a seguinte função e publicar como Web App:
//
//   function doPost(e) {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     var data = JSON.parse(e.postData.contents);
//     sheet.appendRow([
//       new Date(),
//       data.nome || "",
//       data.setor || "",
//       data.avaliacao || "",
//       data.funcionou || "",
//       data.melhorar || "",
//       data.problemas || "",
//     ]);
//     return ContentService
//       .createTextOutput(JSON.stringify({ success: true }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.FEEDBACK_GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    console.error("[feedback] FEEDBACK_GOOGLE_SCRIPT_URL não configurada");
    return NextResponse.json(
      { error: "Serviço de feedback não configurado" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Google Script respondeu com status ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[feedback] Erro ao enviar para Google Sheets:", err);
    return NextResponse.json(
      { error: "Falha ao registrar feedback" },
      { status: 500 }
    );
  }
}
