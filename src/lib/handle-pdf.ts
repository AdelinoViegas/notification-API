import jsPDF from "jspdf";
import type { 
  AppointmentRecord, 
  PatientRecord, 
  ScreeningRecord, 
  Group, 
  ScheduleExamsRecord
} from "@/components/pdf-button";
import type { 
  Assured,
  Employee,
} from "@/backend/api/clinical/types";
// import { getDateInSlashFormat } from "./date-formater";
import { patientPlug, browserPdf } from "./pdf-templates";
import { generate } from "@pdfme/generator";
import { image, rectangle, text, barcodes, line  } from "@pdfme/schemas";

const doc = new jsPDF();

// function  patientRecord({
//   personal,
//   demography,
//   responsibles,
//   group
// }: PatientRecord){ 
//   const margin = { x: 10, y: 10 };
//   const patientGroup = JSON.parse(group) as Group; 
//   const assured = patientGroup?.group as Assured;
//   const employee = patientGroup?.group as Employee;
//   //const enterprise = patientGroup?.group as Enterprise; 

//   doc.setFontSize(10);
//   doc.addImage('/logo.png', 'PNG', margin.x, margin.y, 19, 24);
  
//   margin.x *= 20;

//   doc.text([
//     "Rua Manuel GG Diogo Nº 225",
//     "Maianga-Luanda",
//     "+244 222 222 222"
//   ], margin.x, margin.y+8, { align: 'right' });
  
//   margin.x = 71;
//   margin.y *= 4.4;

//   doc.setFontSize(10);
//   doc.setFont("Helvetica", "bold");
//   doc.text('FICHA DE CADASTRO DE PACIENTE', margin.x, margin.y);
  
//   margin.x = 10;
//   margin.y *= 1.3;

//   doc.setFillColor("#ececec");
//   doc.rect(margin.x, margin.y-4, 190, 6, 'F');
//   doc.text('1.Dados pessoais', margin.x, margin.y);

//   margin.x = 10 * 16; 
  
//   doc.setFillColor('#000');
//   doc.rect(margin.x, margin.y - 12, 40, 45);
//   doc.setFillColor('#fff');
//   doc.rect(margin.x+.5, margin.y+.5 - 12, 40-1, 45-1, 'F');
  
//   margin.x = 10;
//   margin.y += 10;
//   doc.text("COD: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("3994394934", margin.x+11, margin.y);
  
//   margin.y += 8;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nome Completo: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(personal?.fullname || '', margin.x*3.97, margin.y);

//   margin.y += 6;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Data de Nascimento: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(personal?.birthDate?.toLocaleDateString('pt') || ''), margin.x*4.62, margin.y);

//   margin.x *= 7.22;

//   doc.setFont("Helvetica", "bold");
//   doc.text("B.I/Certidão/P.Porte:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(personal?.documentation || '', margin.x*1.49, margin.y);
  
//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Estado Civil: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(personal?.civilState || ''), margin.x*3.28, margin.y);

//   margin.x *= 6.20;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Idade:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(personal?.age || ''), margin.x*1.18, margin.y);
  
//   margin.x *= 1.38;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Sexo: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(personal.gender?String(personal?.gender).toUpperCase()[0]:'', margin.x*1.12, margin.y);
  
//   margin.x *= 1.22;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Telefone: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(personal?.tel || ''), margin.x*1.16, margin.y);
  
//   margin.y += 14;
//   margin.x = 10;
  
//   doc.setFont("Helvetica", "bold");
//   doc.setFillColor("#ececec");
//   doc.rect(margin.x, margin.y-4, 190, 6, 'F');
//   doc.text('2.Dados Demográficos', margin.x, margin.y);
 
//   margin.y += 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nacionalidade:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(demography?.nationality || ''), margin.x*3.65, margin.y);
  
//   margin.x *= 7.70;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Naturalidade: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(demography?.naturality || ''), margin.x*1.31, margin.y);

//   margin.x *= 1.95;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Província: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(demography?.province || ''), margin.x*1.124, margin.y);

//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Morada Actual:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(demography.actualLocation || '', margin.x*3.72, margin.y);
  
//   margin.x *= 10.11;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Rua:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(demography?.street || ''), margin.x*1.087, margin.y);
  
//   margin.x *= 1.49;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Casa Nª: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(String(demography?.homeNumber || ''), margin.x*1.104, margin.y);

//   margin.y += 14;
//   margin.x = 10;
  
//   doc.setFont("Helvetica", "bold");
//   doc.setFillColor("#ececec");
//   doc.rect(margin.x, margin.y-4, 190, 6, 'F');
//   doc.text('3.Responsáveis', margin.x, margin.y);
 
//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nome Completo:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(responsibles[0].name, margin.x*4, margin.y);
  
//   margin.x *= 10.2;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Parentesco: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(responsibles[0].kinship, margin.x*1.21, margin.y);

//   margin.x *= 1.482;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Telefone: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(responsibles[0].tel, margin.x*1.114, margin.y);

//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nome Completo:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(responsibles[1]?.name || '', margin.x*4, margin.y);
  
//   margin.x *= 10.2;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Parentesco: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(responsibles[1]?.kinship || '', margin.x*1.21, margin.y);

//   margin.x *= 1.484;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Telefone: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(responsibles[1]?.tel || '', margin.x*1.115, margin.y);

//   margin.y += 14;
//   margin.x = 10;
  
//   doc.setFont("Helvetica", "bold");
//   doc.setFillColor("#ececec");
//   doc.rect(margin.x, margin.y-4, 190, 6, 'F');
//   doc.text('4.Grupo de Utente', margin.x, margin.y);

//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("a ) Particular:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(patientGroup?.type === "personal" ? "Particular" :"", margin.x*3.4, margin.y);

//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("b ) Empresa", margin.x, margin.y);

//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nome da Empresa:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("'enterprise?.name' ?? ", margin.x*4.368, margin.y);
  
//   margin.x *= 7.6;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Nª de Passe: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("'enterprise?.passNumber' ?? ", margin.x*1.295, margin.y);

//   margin.x *= 1.54;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Função: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("'enterprise?.role ??' ", margin.x*1.128, margin.y);

//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("c ) Funcionário", margin.x, margin.y);

//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nª de Passe:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(employee?.passNumber ?? "", margin.x*3.25, margin.y);
  
//   margin.x *= 5.3;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Função: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(employee?.role ?? "", margin.x*1.28, margin.y);

//   margin.x *= 2.22;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Área de Serviço: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(employee?.workArea ?? "", margin.x*1.25, margin.y);

//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("d ) Asseguradora", margin.x, margin.y);

//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nome da Asseguradora:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(assured.name ?? "", margin.x*5.22, margin.y);
  
//   margin.x *= 8.58;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Nª da Apólice: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(assured?.apolice?.toString() ?? "", margin.x*1.296, margin.y);

//   margin.x *= 1.51;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Nª de Telefone: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text(assured.tel ?? "", margin.x*1.21, margin.y);
 
//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Detalhes: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("Uma asseguradora de renome a nível nacional e tendo várias estações em varias parte de Angola, estamos trabalhando para continuar sempre a ser a número do país", margin.x*2.83, margin.y, {maxWidth: 180});

//   margin.y += 20;
//   margin.x = 10;
  
//   doc.setFont("Helvetica", "bold");
//   doc.setFillColor("#ececec");
//   doc.rect(margin.x, margin.y-4, 190, 6, 'F');
//   doc.text('5.Tipo de Acesso', margin.x, margin.y);

//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("a ) Directo:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("Directo", margin.x*2.97, margin.y);

//   margin.y += 10;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("b ) Transferido/a", margin.x, margin.y);

//   margin.y += 6;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Unidade Externa:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("Hospital Américo Boa Vida", margin.x*4.04, margin.y);

//   margin.x *= 10.7;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Bairro:", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("Patriota", margin.x*1.12, margin.y);
  
//   margin.x *= 1.42;
  
//   doc.setFont("Helvetica", "bold");
//   doc.text("Município: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("Luanda", margin.x*1.125, margin.y);
  
//   margin.y += 7;
//   margin.x = 10;

//   doc.setFont("Helvetica", "bold");
//   doc.text("Província: ", margin.x, margin.y);
//   doc.setFont("Helvetica", "normal");
//   doc.text("Talatona", margin.x*2.82, margin.y);
 
//   margin.y += 10;
//   margin.x = 10;

//   doc.setFontSize(8);
//   doc.text(doc.splitTextToSize('Processado por Master, Sistema Integrado de Gestão - ERP. Reservados todos os Direitos do produtor.',100), margin.x, margin.y);

//   margin.x += 159;

//   doc.text(doc.splitTextToSize('master.socompser.co.ao',100), margin.x, margin.y);

//   doc.output('dataurlnewwindow', { 
//     filename: 'ficha_de_cadastro.pdf', 
//   });
// }

function  patientRecord({
  personal,
  demography,
  responsibles,
  group
}: PatientRecord){ 
  try{

    generate({
      template: patientPlug,
      inputs: [
        {
          registerNumber: "10000000",
          fullname: personal.fullname,
          doc: personal.documentation,
          birthDate: personal.birthDate?.toISOString().split("T")[0],
          civilState: personal.civilState,
          age: personal.age?.toString(),
          patientTel: personal.tel,
          rFullname1: responsibles[0].name,
          rCivilState1: responsibles[0].kinship,
          rTel1: responsibles[0].tel
        }
      ],
      plugins: {
        rectangle,
        text,
        image,
        qrcode: barcodes.qrcode,
        line
      }
    })
    .then(e => browserPdf(e))

  }catch {

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