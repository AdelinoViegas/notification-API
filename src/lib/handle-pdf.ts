import { z } from "zod";
import jsPDF from "jspdf";
import type { 
  AppointmentRecord, 
  PatientRecord, 
  ScreeningRecord, 
  ScheduleExamsRecord
} from "@/components/pdf-button";
import { patientPlug, browserPdf } from "./pdf-templates";
import { generate } from "@pdfme/generator";
import { image, rectangle, text, barcodes, line } from "@pdfme/schemas";
import { AngolaProvices } from "@/backend/api/clinical/translator";
import type { Template } from "@pdfme/common";

const doc = new jsPDF();

const _GroupSchema = z.object({
  type: z.union([
    z.literal("personal"), 
    z.literal("enterprise"), 
    z.literal("employee"), 
    z.literal("assured")
  ]),
  group: z.object()
});

type GroupT = z.infer<typeof _GroupSchema>;


function  patientRecord({
  personal,
  demography,
  responsibles,
  group,
  acess
}: PatientRecord){
  
  const fonts = {
    "Roboto-Bold": { data: "/fonts/roboto/Roboto_Condensed-Black.ttf" },
    "Roboto": { data: "/fonts/roboto/Roboto_Condensed-Bold.ttf", fallback: true },
    "Roboto-ExtraBold": { data: "/fonts/roboto/Roboto_Condensed-ExtraBold.ttf" },

  };

  /*const fonts: Font = {
  "Roboto": {
    data: "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf",
    fallback: true
  },
  "Roboto-Bold": {
    data: "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf"
  }
 }*/

  const templateWithFonts: Template = {
    ...patientPlug,
    fonts
  };

  try{
    const _group = JSON.parse(group) as GroupT;
    generate({
      template: templateWithFonts,
      inputs: [
        {
          registerNumber: personal.registerNumber,
          fullname: personal.fullname,
          doc: personal.documentation,
          birthDate: personal.birthDate?.toISOString().split("T")[0],
          civilState: personal.civilState,
          age: personal.age?.toString(),
          patientTel: personal.tel,
          gender: personal.gender?.at(0)?.toUpperCase(),
          nationality: demography.nationality,
          naturality: demography.naturality,
          province: AngolaProvices.find(e => e._id === demography.province)?.label,
          actualLocation: demography.actualLocation,
          street: demography.street,
          homeNumber: demography.homeNumber,
          rFullname1: responsibles[0].name,
          rCivilState1: responsibles[0].kinship,
          rTel1: responsibles[0].tel,
          rFullname2: responsibles[1].name,
          rCivilState2: responsibles[1].kinship,
          rTel2: responsibles[1].tel,
          particular: _group.type === "personal" ? "Particular" : "N/D",
          enterpriseName: _group.type === "enterprise" ? _group.group?.name : "N/D",
          enterprisePassNumber: _group.type === "enterprise" ? _group.group.passNumber : "N/D",
          enterpriseFunction: _group.type === "enterprise" ? _group.group.role : "N/D",
          assuredName: _group.type === "assured" ? _group.group?.name : "N/D",
          assuredNumber: _group.type === "assured" ? String(_group.group.apolice) : "N/D",
          assuredTel: _group.type === "assured" ? _group.group.tel : "N/D",
          assuredDetail: _group.type === "assured" ? _group.group.detail : "N/D",
          employeeNumber: _group.type === "employee" ? _group.group?.passNumber : "N/D",
          employeeRole: _group.type === "employee" ? _group.group.role : "N/D",
          employeeService: _group.type === "employee" ? _group.group.workArea : "N/D",
          directAccess: acess?.type === "direct" ? "Directo" : "N/D",
          fromHospital: acess?.type === "transferred" ? acess.hospital : "N/D",
          hospitalStreet: acess?.type === "transferred" ? acess.street : "N/D",
          hospitalMunicipality: acess?.type === "transferred" ? acess.municipality : "N/D",
          hospitalProvince: acess?.type === "transferred" ? acess.province : "N/D",
        }
      ],
      plugins: {
        rectangle,
        text,
        image,
        qrcode: barcodes.qrcode,
        line
      },
    })
    .then(e => browserPdf(e))

  }catch(err) {
    console.log(err);
  }
}

function screeningRecord({
  reason,
  status,
  advice,
  vitalsSignal,
}: ScreeningRecord){
  const margin = { x: 10, y: 10 };
  doc.setFontSize(9);
  doc.text("SOCOMPSER", margin.x, margin.y+10);
  margin.x *= 20;
  doc.text([
    "Rua Manuel GG Diogo Nº 225",
    "Maianga-Luanda",
    "+244 222 222 222"
  ], margin.x, margin.y+10, { align: 'right' });
  margin.x = 85;
  margin.y *= 5;
  doc.setFontSize(11);
  doc.text('FICHA DE TRIAGEM', margin.x, margin.y);

  margin.x = 10;
  margin.y += 14;
  
  doc.setFont("Helvetica","bold")
  doc.text("COD: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("3994394934", margin.x+11, margin.y);
  
  margin.x *= 5.3;

  doc.setFont("Helvetica", "bold");
  doc.text("Nome Completo: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("Domingos Gaspar Silva dos Santos", margin.x*1.62, margin.y);
 
  margin.x = 10;
  margin.y *= 1.2;
 
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('1.Motivo da Vinda', margin.x, margin.y);
  
  margin.x = 10;
  margin.y += 10;

  doc.setFont("Helvetica", "bold");
  doc.text('Queixa Principal', margin.x, margin.y);

  margin.y += 5;
  doc.setFont("Helvetica","normal");
  doc.text(doc.splitTextToSize(reason,188), margin.x, margin.y);

  margin.x = 10;
  margin.y += 28;

  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 104, 6, 'F');
  doc.text('2.Sinais Vitais', margin.x, margin.y);
  
  margin.y += 10;
  
  doc.setFillColor("#ffffff");
  doc.rect(margin.x, margin.y-6, 104, 90, 'DF');
  
  margin.y += 1;
  margin.x = 10;

  doc.setFont("Helvetica","normal");
  doc.text('P.A máxima (mmHG): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.paMax,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('P.A mínima (mmHG): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.paMin,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('Pulo (BPM): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.jump,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('PVC (CH20): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.pvc,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('SpO2 (%): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.sp02,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('Temperatura (ª): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.temperature,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('Respiração (IRPM): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.breathing,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('Peso (Kg): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.weight,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('Altura (m): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.height,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('Glicemia (mg/dl): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.bloodGlucose,margin.x+4,margin.y);

  margin.y += 8;
  margin.x = 10;

  doc.text('IMC (kg/m²): ',margin.x+4,margin.y);
  margin.x *= 4.90;
  doc.text(vitalsSignal.imc,margin.x+4,margin.y);

  margin.x = 10;
  margin.y -= 91;
  margin.x *= 12.15;

  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x-2, margin.y-4, 80, 6, 'F');
  doc.text('3.Grau de Prioridade', margin.x, margin.y);

  margin.y += 10;

  doc.setFillColor("#ffffff");
  doc.rect(margin.x-2, margin.y-6, 80, 90, 'DF');
  
  doc.rect(margin.x-2, margin.y-6, 80, 6, 'DF');

  margin.y += 6;

  doc.setFont("Helvetica","normal");
  doc.setFontSize(10);
  doc.rect(margin.x-2, margin.y-6, 30, 6, 'DF');
  margin.y += 5;
  doc.text("Prioridade",margin.x+5, margin.y-7);
  
  margin.y -= 5;
  margin.x *= 1.24;

  doc.setFillColor("#ffffff");
  doc.rect(margin.x-2, margin.y-6, 20, 6, 'DF');
  margin.y += 5;
  doc.text("Cor",margin.x+5, margin.y-7);

  margin.y -= 5;
  margin.x *= 1.13;

  doc.setFillColor("#ffffff");
  doc.rect(margin.x-2, margin.y-6, 31.2, 6, 'DF');
  margin.y += 5;
  doc.text("Tempo de Espera",margin.x, margin.y-7);
 
  margin.x = 10;
  margin.y += 6;
  margin.x *= 12.15;

  doc.setFillColor("#ffffff");
  doc.rect(margin.x-2, margin.y-6, 30, 6, 'DF');
  margin.y += 5;
  doc.text("Muito Urgente",margin.x, margin.y-7);
  
  margin.y -= 5;
  margin.x *= 1.24;
  doc.setFillColor("#FFA500");
  doc.rect(margin.x-2, margin.y-6, 20, 6, 'DF');
  margin.y += 5;
  doc.text("",margin.x+5, margin.y-7);

  margin.y -= 5;
  margin.x *= 1.13;
  doc.setFillColor("#ffffff");
  doc.rect(margin.x-2, margin.y-6, 31.2, 6, 'DF');
  margin.y += 5;
  doc.text("10 minutos",margin.x, margin.y-7);
 
  margin.y += 20;
  margin.x = 10;
  margin.x *= 12.20;
  
  doc.setFont("Helvetica","bold");
  doc.text("Descrição ",margin.x, margin.y-7);

  margin.y += 6;
  margin.x = 10;
  margin.x *= 10.40;

  doc.setFont("Helvetica","normal");
  doc.text(doc.splitTextToSize("O Utente entra na sala de espera e pode esperar pelo/n atendimento num tempo não superior a 10 minutos",74),margin.x*1.20, margin.y-7);
 
  margin.y += 50;
  margin.x = 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('4.Estado Actual do doente', margin.x, margin.y);
  
  margin.y += 15;
  doc.setFont("Helvetica","normal");
  doc.text(doc.splitTextToSize(status,188),margin.x*1.20, margin.y-7);
 
  margin.y += 18;
  margin.x = 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('5.Recomendações', margin.x, margin.y);
  
  margin.y += 15;
  doc.setFont("Helvetica","normal");
  doc.text(doc.splitTextToSize(advice,188),margin.x*1.20, margin.y-7);
  
  margin.y += 14;
  margin.x = 10;

  doc.setFontSize(8);
  doc.text(doc.splitTextToSize('Processado por Master, Sistema Integrado de Gestão - ERP. Reservados todos os Direitos do produtor.',100), margin.x, margin.y);

  margin.x += 159;

  doc.text(doc.splitTextToSize('master.socompser.co.ao',100), margin.x, margin.y);

  doc.output('dataurlnewwindow', { filename: 'ficha_de_triagem.pdf' });
}

function appointmentRecord({
  patientName,
  age, 
  gender,
  date,
  hour,
  consultationType,
  consultationPrice,
}: AppointmentRecord){
  const margin = { x: 10, y: 10};
  margin.y = 7;
  doc.setTextColor("#000000");
  doc.setFontSize(9);
  doc.text("SOCOMPSER", margin.x, margin.y+10);
  
  margin.y = 10;
  margin.x *= 20;
  doc.setFontSize(10);

  [
    "Rua Manuel GG Diogo Nº 225",
    "geral@socompser.co.ao",
    "Maianga-Luanda",
    "+244 222 222 222"
  ].forEach((line, index) => {
    doc.text(line, margin.x, margin.y + 10 + (index * 5.2), { align: 'right' });
  });
  
  margin.x = 70;
  margin.y *= 4.2;
  doc.setFontSize(9);
  doc.setFont("Helvetica","bold")
  doc.text('GUIA DE AGENDAMENTO DE CONSULTA', margin.x, margin.y);

  margin.x = 10;
  margin.y *= 1.4;
 
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('1.Dados do utente', margin.x+1, margin.y);
  
  margin.x = 10;
  margin.y += 10;

  doc.rect(margin.x, margin.y-14, 190, 28, 'S');
 
  margin.y += 3;
  margin.x = 10;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("COD: ", margin.x*16, margin.y, {align: 'right'});
  doc.setFont("Helvetica", "normal");
  doc.text('4@@@1543454545', margin.x*19, margin.y, {align: 'right'});

  margin.y += 6;
  margin.x = 10;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Nome Completo: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(patientName ?? '', margin.x*3.8, margin.y);

  margin.x *= 12.1;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Idade: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(`${age  ?? ''}`, margin.x*1.099, margin.y);

  margin.x *= 1.24;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Sexo: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(gender?String(gender).toUpperCase()[0]:'', margin.x*1.07, margin.y);
  
  margin.x = 10;
  margin.y *= 1.21;
 
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('2.Dados da consulta', margin.x+1, margin.y);
  
  margin.x = 10;
  margin.y += 10;

  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.text("Data/hota da consulta", margin.x*1.1, margin.y,);
  doc.setFont("Helvetica", "normal");
  doc.text(`${date  ?? ''} ${hour  ?? ''}`, margin.x*19.9, margin.y, {align: 'right'});

  margin.x = 10;
  margin.y += 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('2.Descrição da consulta', margin.x+1, margin.y);
  doc.text('Valor', margin.x*19.9, margin.y, {align: 'right'});
  
  margin.x = 10;
  margin.y += 10;
 
  doc.setFont("Helvetica", "normal");
  doc.text(`${consultationType  ?? ''}....................................................................................................`, margin.x+1, margin.y);
  doc.text(`${consultationPrice  ?? ''} kz`, margin.x*19.9, margin.y, {align: 'right'});
  
  margin.y += 55;
  doc.setFont("Helvetica", "bold");
  doc.text('Total da consulta...........................................', margin.x+1, margin.y);
  doc.text(`${consultationPrice  ?? ''} kz`, margin.x*19.9, margin.y, {align: 'right'});
  
  margin.y += 8;
  doc.text('Contravalor(usd)..............................................................', margin.x+1, margin.y);
  doc.text('10,00', margin.x*19.9, margin.y, {align: 'right'});
  
  doc.rect(margin.x, margin.y-97, 190, 100, 'S');

  margin.y += 18;
  doc.setFont("Helvetica", "bold");
  doc.text('Obs.', margin.x*1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text('Apresentar esta guia na data da consulta', margin.x*1.8, margin.y);
  
  margin.x = 10;
  margin.y += 60;
  
  doc.setFont("Helvetica", "normal");
  doc.setTextColor("#000000");
   [
    "Processado por Master",
    "Sistema Integrado de Gestão - ERP.",
    "Reservados todos os Direitos do Desenvolvedor",
  ].forEach((line, index) => {
    doc.text(line, margin.x, margin.y + 10 + (index * 5.2));
  });

  doc.text('Usuário: Akapa Gomes',margin.x*9, margin.y+20);
  doc.text('master.socompser.co.ao',margin.x*20, margin.y+6, { align: 'right'});

  doc.output('dataurlnewwindow', { filename: 'agendamento-consultas.pdf' });
}

function scheduleExamsRecord({
  patientName,
  age, 
  gender,
  date,
  exams,
  examsTotalPrice,
}: ScheduleExamsRecord){
  const margin = { x: 10, y: 10};
  margin.y = 7;
  doc.setTextColor("#000000");
  doc.setFontSize(9);
  doc.text("SOCOMPSER", margin.x, margin.y+10);
  
  margin.y = 10;
  margin.x *= 20;
  doc.setFontSize(10);

  [
    "Rua Manuel GG Diogo Nº 225",
    "geral@socompser.co.ao",
    "Maianga-Luanda",
    "+244 222 222 222"
  ].forEach((line, index) => {
    doc.text(line, margin.x, margin.y + 10 + (index * 5.2), { align: 'right' });
  });
  
  margin.x = 75;
  margin.y *= 4.2;
  doc.setFontSize(9);
  doc.setFont("Helvetica","bold")
  doc.text('GUIA DE AGENDAMENTO DE EXAME', margin.x, margin.y);

  margin.x = 10;
  margin.y *= 1.4;
 
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('1.Dados do utente', margin.x+1, margin.y);
  
  margin.x = 10;
  margin.y += 10;

  doc.rect(margin.x, margin.y-14, 190, 28, 'S');
 
  margin.y += 3;
  margin.x = 10;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("COD: ", margin.x*16, margin.y, {align: 'right'});
  doc.setFont("Helvetica", "normal");
  doc.text('4@@@1543454545', margin.x*19, margin.y, {align: 'right'});

  margin.y += 6;
  margin.x = 10;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Nome Completo: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(patientName ?? '', margin.x*3.8, margin.y);

  margin.x *= 12.1;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Idade: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(`${age ?? ''}`, margin.x*1.099, margin.y);

  margin.x *= 1.24;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Sexo: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(gender?String(gender).toUpperCase()[0]:'', margin.x*1.07, margin.y);
  
  margin.x = 10;
  margin.y *= 1.21;
 
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('2.Dados da consulta', margin.x+1, margin.y);
  
  margin.x = 10;
  margin.y += 10;

  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.text("Data/hota do (s) exame (s)", margin.x*1.1, margin.y,);
  doc.setFont("Helvetica", "normal");
  doc.text(`${date  ?? ''}`, margin.x*19.9, margin.y, {align: 'right'});

  margin.x = 10;
  margin.y += 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('Descrição da consulta', margin.x+1, margin.y);
  doc.text('Valor', margin.x*19.9, margin.y, {align: 'right'});
  
  margin.x = 10;
  margin.y += 10;
 
  doc.setFont("Helvetica", "normal");
  exams?.forEach((props) => {
    doc.text(`${props.name}....................................................................................................`, margin.x+1, margin.y);
    doc.text(`${props.price} kz`, margin.x*19.9, margin.y, {align: 'right'});
    margin.y += 8;
  });

  margin.y += 55;
  doc.setFont("Helvetica", "bold");
  doc.text('Total dos Exames...........................................', margin.x+1, margin.y);
  doc.text(`${examsTotalPrice} kz`, margin.x*19.9, margin.y, {align: 'right'});
  
  margin.y += 8;
  doc.text('Contravalor(usd)..............................................................', margin.x+1, margin.y);
  doc.text('10,00', margin.x*19.9, margin.y, {align: 'right'});
  
  doc.rect(margin.x, margin.y-113, 190, 115, 'S');

  margin.y += 18;
  doc.setFont("Helvetica", "bold");
  doc.text('Obs.', margin.x*1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text('Apresentar esta guia na data do exame', margin.x*1.8, margin.y);
  
  margin.x = 10;
  margin.y += 44;
  
  doc.setFont("Helvetica", "normal");
  doc.setTextColor("#000000");
   [
    "Processado por Master",
    "Sistema Integrado de Gestão - ERP.",
    "Reservados todos os Direitos do Desenvolvedor",
  ].forEach((line, index) => {
    doc.text(line, margin.x, margin.y + 10 + (index * 5.2));
  });

  doc.text('Usuário: Akapa Gomes',margin.x*9, margin.y+20);
  doc.text('master.socompser.co.ao',margin.x*20, margin.y+6, { align: 'right'});

  doc.output('dataurlnewwindow', { filename: 'agendamento-exames.pdf' });
}

export {
  patientRecord,
  screeningRecord,
  appointmentRecord,
  scheduleExamsRecord,
}