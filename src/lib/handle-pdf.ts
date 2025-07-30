import jsPDF from "jspdf";
import { AppointmentRecord, PatientRecord, ScreeningRecord } from "@/components/pdf-button";

const doc = new jsPDF();

function patientRecord({
  personal,
  demography
}:  PatientRecord){
  const margin = { x: 10, y: 10 };

  doc.setFontSize(9);
  doc.addImage('/logo.png', 'PNG', margin.x, margin.y, 20, 25);
  
  margin.x *= 20;

  doc.text([
    "Rua Manuel GG Diogo Nº 225",
    "Maianga-Luanda",
    "+244 222 222 222"
  ], margin.x, margin.y+10, { align: 'right' });
  
  margin.x = 85;
  margin.y *= 5;

  doc.setFontSize(11);
  doc.setFont("Helvetica", "bold");
  doc.text('FICHA DE CADASTRO', margin.x, margin.y);
  
  margin.x = 10;
  margin.y *= 1.3;

  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('1.Dados pessoais', margin.x, margin.y);

  margin.x = 10 * 16; 
  
  doc.setFillColor('#000');
  doc.rect(margin.x, margin.y - 12, 40, 45);
  doc.setFillColor('#fff');
  doc.rect(margin.x+.5, margin.y+.5 - 12, 40-1, 45-1, 'F');
  
  margin.x = 10;
  margin.y += 10;
  doc.text("COD: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("3994394934", margin.x+11, margin.y);
  
  margin.y += 8;

  doc.setFont("Helvetica", "bold");
  doc.text("Nome Completo: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(personal.fullname, margin.x*4.2, margin.y);

  margin.y += 6;

  doc.setFont("Helvetica", "bold");
  doc.text("Data de Nascimento: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(personal.birthDate?.toLocaleDateString()), margin.x*5, margin.y);

  margin.x *= 7.22;

  doc.setFont("Helvetica", "bold");
  doc.text("B.I/Certidão/P.Porte:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(personal.documentation, margin.x*1.55, margin.y);
  
  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Estado Civil: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(personal.civilState), margin.x*3.42, margin.y);

  margin.x *= 6.22;

  doc.setFont("Helvetica", "bold");
  doc.text("Idade:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(personal.age), margin.x*1.20, margin.y);
  
  margin.x *= 1.38;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Sexo: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(personal.gender).toUpperCase()[0], margin.x*1.13, margin.y);
  
  margin.x *= 1.22;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Telefone: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(personal.tel), margin.x*1.17, margin.y);
  
  margin.y += 14;
  margin.x = 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('2.Dados Demográficos', margin.x, margin.y);
 
  margin.y += 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Nacionalidade:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(demography?.nationality), margin.x*3.96, margin.y);
  
  margin.x *= 7.70;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Naturalidade: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(demography?.naturality), margin.x*1.34, margin.y);

  margin.x *= 1.90;

  doc.setFont("Helvetica", "bold");
  doc.text("Província: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(String(demography?.province), margin.x*1.14, margin.y);

  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Morada Actual:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(demography.actualLocation, margin.x*3.91, margin.y);
  
  margin.x *= 10.28;

  doc.setFont("Helvetica", "bold");
  doc.text("Rua:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text((String(demography?.street) === "undefined")?"":String(demography?.street), margin.x*1.10, margin.y);
  
  margin.x *= 1.52;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Casa Nª: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text((String(demography?.homeNumber) === "undefined")?"":String(demography?.homeNumber), margin.x*1.12, margin.y);

  margin.y += 14;
  margin.x = 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('3.Responsáveis', margin.x, margin.y);
 
  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Nome Completo:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("Xeila Carla Luíz da Silva Ribeiro", margin.x*4.24, margin.y);
  
  margin.x *= 10.1;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Patentesco: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("sobrinho/a", margin.x*1.23, margin.y);

  margin.x *= 1.44;

  doc.setFont("Helvetica", "bold");
  doc.text("Telefone: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("987453621", margin.x*1.13, margin.y);

  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Nome Completo:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Júlio Patrício Gustavo Terêncio"*/'', margin.x*4.24, margin.y);
  
  margin.x *= 10.1;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Patentesco: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"sobrinho/a"*/'', margin.x*1.23, margin.y);

  margin.x *= 1.44;

  doc.setFont("Helvetica", "bold");
  doc.text("Telefone: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"974495621"*/'', margin.x*1.13, margin.y);

  margin.y += 14;
  margin.x = 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('4.Grupo de Utente', margin.x, margin.y);

  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("a ) Particular:", margin.x, margin.y);
 
  margin.x *= 3.60;

  doc.setFont("Helvetica", "normal");
  doc.text(/*"particular"*/'', margin.x, margin.y);

  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("b ) Empresa", margin.x, margin.y);

  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Nome da Empresa:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("Agrilc XrT Lda", margin.x*4.68, margin.y);
  
  margin.x *= 7.6;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Nª de Passe: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("12450", margin.x*1.33, margin.y);

  margin.x *= 1.54;

  doc.setFont("Helvetica", "bold");
  doc.text("Função: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text("Gestor de Projectos", margin.x*1.15, margin.y);

  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("c ) Funcionário", margin.x, margin.y);

  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Nª de Passe:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"145720"*/'', margin.x*3.59, margin.y);
  
  margin.x *= 5.3;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Função: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Desenvolvedor Fullstack"*/'', margin.x*1.33, margin.y);

  margin.x *= 2.22;

  doc.setFont("Helvetica", "bold");
  doc.text("Área de Serviço: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Secção-A"*/'', margin.x*1.28, margin.y);

  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("d ) Asseguradora", margin.x, margin.y);

  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Nome da Asseguradora:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Nossa Seguros"*/'', margin.x*5.60, margin.y);
  
  margin.x *= 8.58;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Nª da Apólice: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"215410"*/'', margin.x*1.32, margin.y);

  margin.x *= 1.51;

  doc.setFont("Helvetica", "bold");
  doc.text("Nª de Telefone: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"971203521"*/'', margin.x*1.23, margin.y);
 
  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Detalhes: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Uma asseguradora de renome a nível nacional"*/'', margin.x*2.83, margin.y);

  margin.y += 14;
  margin.x = 10;
  
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#ececec");
  doc.rect(margin.x, margin.y-4, 190, 6, 'F');
  doc.text('4.Tipo de Acesso', margin.x, margin.y);

  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("a ) Directo:", margin.x, margin.y);
  
  margin.x *= 3.18;

  doc.setFont("Helvetica", "normal");
  doc.text("Directo", margin.x, margin.y);

  margin.y += 10;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("b ) Transferido/a", margin.x, margin.y);

  margin.y += 6;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Unidade Externa:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Américo Boa Vida"*/'', margin.x*4.43, margin.y);

  margin.x *= 8.58;

  doc.setFont("Helvetica", "bold");
  doc.text("Bairro:", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Patriota"*/'', margin.x*1.17, margin.y);
  
  margin.x *= 1.50;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Município: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Luanda"*/'', margin.x*1.17, margin.y);
  
  margin.y += 7;
  margin.x = 10;

  doc.setFont("Helvetica", "bold");
  doc.text("Província: ", margin.x, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(/*"Talatona"*/'', margin.x*2.94, margin.y);
 
  margin.y += 10;
  margin.x = 10;

  doc.setFontSize(8);
  doc.text(doc.splitTextToSize('Processado por Master, Sistema Integrado de Gestão - ERP. Reservados todos os Direitos do produtor.',100), margin.x, margin.y);

  margin.x += 159;

  doc.text(doc.splitTextToSize('master.socompser.co.ao',100), margin.x, margin.y);

  doc.output('dataurlnewwindow', { 
    filename: 'ficha_de_cadastro.pdf', 
  });
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
  doc.text(patientName, margin.x*3.8, margin.y);

  margin.x *= 12.1;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Idade: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(`${age}`, margin.x*1.099, margin.y);

  margin.x *= 1.24;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("Sexo: ", margin.x+1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text(gender, margin.x*1.07, margin.y);
  
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
  doc.text(`${date} ${hour}`, margin.x*19.9, margin.y, {align: 'right'});

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
  doc.text(`${consultationType}....................................................................................................`, margin.x+1, margin.y);
  doc.text(`${consultationPrice} kz`, margin.x*19.9, margin.y, {align: 'right'});
  
  margin.y += 55;
  doc.setFont("Helvetica", "bold");
  doc.text('Total da consulta...........................................', margin.x+1, margin.y);
  doc.text(`${consultationPrice} kz`, margin.x*19.9, margin.y, {align: 'right'});
  
  margin.y += 8;
  doc.text('Contravalor(usd)..............................................................', margin.x+1, margin.y);
  doc.text('10,00', margin.x*19.9, margin.y, {align: 'right'});
  
  doc.rect(margin.x, margin.y-97, 190, 100, 'S');

  margin.y += 18;
  doc.setFont("Helvetica", "bold");
  doc.text('Obs.', margin.x*1, margin.y);
  doc.setFont("Helvetica", "normal");
  doc.text('Apresentar esta guia na data da consulta', margin.x*1.8, margin.y);
  
  margin.y += 8;
  doc.setFont("Helvetica", "bold");
  doc.setFillColor("#fff205");
  doc.rect(margin.x, margin.y-4, 45, 6, 'F');
  doc.setTextColor("#ff0000");
  doc.text('Impressão A4 e A5', margin.x+1, margin.y);
  
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

  doc.output('dataurlnewwindow', { filename: 'ficha_de_triagem.pdf' });
}

export {
  patientRecord,
  screeningRecord,
  appointmentRecord
}