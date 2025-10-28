import { z } from "zod";
import type { 
  AppointmentRecord, 
  PatientRecord, 
  ScreeningRecord, 
  ScheduleExamsRecord
} from "@/components/pdf-button";
import { patientPlug, appointmentPlug, examPlug, screeningPlug, browserPdf } from "@/lib/pdf-templates";
import formatMoney from "@/lib/format-money";
import { generate } from "@pdfme/generator";
import { image, rectangle, text, barcodes, line } from "@pdfme/schemas";
import { AngolaProvices } from "@/backend/api/clinical/translator";

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
  /*const fonts = {
    "Roboto-Bold": { data: "/fonts/roboto/Roboto-Bold.ttf" },
    "Roboto": { data: "/fonts/roboto/Roboto-Regular.ttf", fallback: true },
    "Roboto-ExtraBold": { data: "/fonts/roboto/Roboto-ExtraBold.ttf" },
  };

  const templateWithFonts: Template = {
    ...patientPlug,
    fonts
  };*/

  try{
    const _group = JSON.parse(group) as GroupT;

    generate({
      template: patientPlug,
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
  }catch {}
}

function screeningRecord({
  reason,
  status,
  advice,
  priority,
  vitalSignals,
}: ScreeningRecord){
  const data = [
    { 
      description: "Emergência", 
      color: "red", 
      hex: "#FF0000",
      time: "0 minnuto"
    },
    { 
      description: "Muito Urgente", 
      color: "orange", 
      hex: "#FFA500",
      time: "10 minnutos"
    },
    { 
      description: "Urgente", 
      color: "yellow", 
      hex: "#FFFF00",
      time: "60 minnutos"
    },
    { 
      description: "Pouco Urgente", 
      color: "green", 
      hex: "#008000",
      time: "120 minnutos"
    },
    { 
      description: "Não Urgente", 
      color: "blue", 
      hex: "#0000FF",
      time: "240 minnutos"
    }
  ].find( props => props.color === priority);
  
 const template = JSON.parse(JSON.stringify(screeningPlug));


  template.schemas[0].push(
    {
      "name": "priority",
      "type": "text",
      "content": "prioridade",
      "position": {
          "x": 122,
          "y": 120
      },
      "width": 45,
      "height": 5,
      "rotate": 0,
      "alignment": "left",
      "verticalAlignment": "middle",
      "fontSize": 11,
      "lineHeight": 1,
      "characterSpacing": 0,
      "fontColor": "#555555",
      "fontName": "Roboto",
      "opacity": 1,
      "strikethrough": false,
      "underline": false,
      "required": true,
      "readOnly": false
    },
    {
      "name": "field32",
      "type": "text",
      "content": "color",
      "position": {
          "x": 152,
          "y": 119
      },
      "width": 16,
      "height": 7,
      "rotate": 0,
      "alignment": "left",
      "verticalAlignment": "middle",
      "fontSize": 11,
      "lineHeight": 1,
      "characterSpacing": 0,
      "fontName": "Roboto",
      "fontColor": `${data?.hex}`,
      "backgroundColor": `${data?.hex}`,
      "opacity": 1,
      "strikethrough": false,
      "underline": false,
      "required": false,
      "readOnly": true
    },
    {
      "name": "field34",
      "type": "text",
      "content": `${data?.time}`,
      "position": {
          "x": 170,
          "y": 120
      },
      "width": 30,
      "height": 5,
      "rotate": 0,
      "alignment": "left",
      "verticalAlignment": "middle",
      "fontSize": 11,
      "lineHeight": 1,
      "characterSpacing": 0,
      "fontName": "Roboto",
      "fontColor": "#000000",
      "opacity": 1,
      "strikethrough": false,
      "underline": false,
      "required": false,
      "readOnly": true
    }
  );

  try{
    generate({
      template,
      inputs: [
        {
          reason,
          status,
          advice: advice || "N/D",
          priority: data?.description as string,
          paMax: vitalSignals.paMax,
          paMin: vitalSignals.paMin,
          jump: vitalSignals.jump,
          pvc: vitalSignals.pvc,
          imc: vitalSignals.imc,
          spo2: vitalSignals.sp02,
          temperature: vitalSignals.temperature,
          breathing: vitalSignals.breathing,
          weight: vitalSignals.weight,
          height: vitalSignals.height,
          bloodGlucose: vitalSignals.bloodGlucose,
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
  }catch {}
}

function appointmentRecord({
  registerNumber,
  fullname,
  age,
  gender,
  date,
  hour,
  consultationType,
  consultationPrice,
}: AppointmentRecord){
  try{
    generate({
      template: appointmentPlug,
      inputs: [
        {
          registerNumber: String(registerNumber),
          fullname,
          age: String(age),
          gender: gender?.at(0)?.toUpperCase(),
          date,
          hour,
          consultationType: `${consultationType}${'.'.repeat(45)}`,
          consultationPrice: formatMoney(consultationPrice),
          totalPrice: formatMoney(consultationPrice)
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
  }catch {}
}
  
function scheduleExamsRecord({
  registerNumber,
  fullname,
  age, 
  gender,
  date,
  exams,
  examsTotalPrice,
}: ScheduleExamsRecord){
  try{
    let posY = 132;
    const examData: Record<string, string> = {};

    exams?.forEach(({id, name, price}) => {
      examData[`Exame${id+1}`] = formatMoney(price);

      examPlug.schemas[0].push(
        {
          "name": `field2${id}`,
          "type": "text",
          "content": `${name}${'.'.repeat(45)}`,
          "position": {
              "x": 11,
              "y": posY
          },
          "width": 145,
          "height": 5,
          "rotate": 0,
          "alignment": "left",
          "verticalAlignment": "top",
          "fontSize": 11,
          "lineHeight": 1,
          "characterSpacing": 0,
          "fontColor": "#555555",
          "fontName": "Roboto",
          "opacity": 1,
          "strikethrough": false,
          "underline": false,
          "required": false,
          "readOnly": true
        },
        {
          "name": `Exame${id+1}`,
          "type": "text",
          "content": "Preço do exame",
          "position": {
              "x": 175,
              "y": posY
          },
          "width": 40,
          "height": 5,
          "rotate": 0,
          "alignment": "left",
          "verticalAlignment": "top",
          "fontSize": 11,
          "lineHeight": 1,
          "characterSpacing": 0,
          "fontColor": "#000000",
          "fontName": "Roboto",
          "opacity": 1,
          "strikethrough": false,
          "underline": false,
          "required": true,
          "readOnly": false
        })

        posY = posY+7;
    });

    generate({
      template: examPlug,
      inputs: [
        {
          registerNumber: String(registerNumber),
          fullname,
          age: String(age),
          gender: gender?.at(0)?.toUpperCase(),
          date,
          ...examData,
          totalPrice: formatMoney(examsTotalPrice)
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
  }catch {}
}

export {
  patientRecord,
  screeningRecord,
  appointmentRecord,
  scheduleExamsRecord,
}