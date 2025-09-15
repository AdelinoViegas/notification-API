// import { GETpatient } from "@/backend/api/clinical/types";
//import { getDataAndHoursFormat, getDateInSlashFormat } from "@/lib/date-formater";

// export type TableRow = {
//   id: string;
//   row: string[]
// };

// export type PatientExam = {
//   _id: string;
//   examCode: string;
//   name: string;
//   category: string;
//   classification: string;
//   group: string;
//   price: string;
// };

// export type ScheduleExam = {
//   id: string;
//   createAt: Date;
//   patientName: string;
//   laboratory: string;
//   examQty: number;
//   user: string;
//   status:string;
// };

// export type ScheduleAppointment = {
//   id: string;
//   hour: string;
//   patient: string;
//   doctor: string;
//   room: string;
//   status: string;
// };

// export type ScheduleSugery = {
//   id: string;
//   date: string;
//   doctor: string;
//   patient: string;
//   sugeryType: string;
//   requestingService: string;
//   infirmary: string;
//   bed: string;
//   status?: string;
// };

// export type DoctorOffice = {
//   id: string;
//   markedDatatime: string;
//   patient: string;
//   user: string;
//   room: string;
// };

// export type PhisicalUnit = {
//   id: string;
//   createAt: Date;
//   unitName: string;
//   type: string;
//   user: string;
//   status: string;
// };

// export type ExternalUnit = {
//   id: string;
//   name: string;
//   street: string;
//   municipality: string;
//   province: string;
//   user: string;
// };

// export type ClinicalUser = {
//   id: string;
//   createdAt: Date;
//   fullname: string;
//   category: string;
//   role: string;
//   workplaces: number;
// };

// export type User = {
//   id: string;
//   createAt: Date;
//   fullname: string;
//   username: string;
//   tel: string;
//   email: string;
//   group: string;
//   status: string;
// };

// export type Calendar = {
//   id: string;
//   description: string;
//   monthName: string;
//   creator: string;
//   createdAt: Date;
// };

// export type Consultation = {
//   id: string;
//   code: string;
//   name: string;
//   price: number;
// };

// export type Services = {
//   id: string,
//   patient: string,
//   markedDatatime: string,
//   user: string
//   nameLaboratory: string 
// };

// type FuncTableProps = GETpatient | PatientExam | ScheduleExam | ScheduleAppointment
// | PhisicalUnit | User | ClinicalUser | Calendar | Services;

export function angolaCurrency(money: number | string){
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(
    money as number,
  );
}

// export default function tableFormater(dataListToTable: FuncTableProps[]){
//   const dataListFormated: TableRow[] = [];
//   try{
//     if(!dataListToTable.length)
//       return [];
    
//     if("price" in dataListToTable[0]){
//       const examData = dataListToTable as PatientExam[];
//       for(const data of examData){
//         dataListFormated.push({
//           id: data._id,
//           row: [
//             data.examCode,
//             data.name,
//             data.category,
//             data.classification,
//             data.group,
//             angolaCurrency(data.price),
//           ]
//         });
//       }
//     }else if("unitName" in dataListToTable[0]){
//       const schedules = dataListToTable as PhisicalUnit[];
//       for(const data of schedules){
//         dataListFormated.push({
//           id: data.id,
//           row: [
//             getDateInSlashFormat(data.createAt),
//             data.unitName,
//             data.type,
//             data.user,
//             data.status,
//           ]
//         });
//       }
//     }else if("description" in dataListToTable[0] && "monthName" in dataListToTable[0]){
//       const calendars = dataListToTable as Calendar[];
//       for(const data of calendars){
//         dataListFormated.push({
//           id: data.id,
//           row: [
//             getDateInSlashFormat(data.createdAt),
//             data.description,
//             data.monthName.toUpperCase(),
//             data.creator
//           ]
//         });
//       }
//     }else if("laboratory" in dataListToTable[0]){
//       const schedules = dataListToTable as ScheduleExam[];
//       for(const data of schedules){
//         dataListFormated.push({
//           id: data.id,
//           row: [
//             getDataAndHoursFormat(data.createAt),
//             data.patientName,
//             data.laboratory,
//             String(data.examQty),
//             data.user,
//             data.status,
//           ]
//         });
//       }
//     }else if("email" in dataListToTable[0]){
//       const users = dataListToTable as User[];
//       for(const data of users){
//         dataListFormated.push({
//           id: data.id,
//           row: [
//             getDateInSlashFormat(data.createAt),
//             data.fullname,
//             data.username,
//             data.tel,
//             data.email,
//             data.group,
//             data.status
//           ]
//         });
//       }
//     }else if("workplaces" in dataListToTable[0]){
//       const users = dataListToTable as ClinicalUser[];
//       for(const data of users){
//         dataListFormated.push({
//           id: data.id,
//           row: [
//             getDateInSlashFormat(data.createdAt),
//             data.fullname,
//             data.category,
//             data.role,
//             data.workplaces as unknown as string,
//           ]
//         });
//       }
//     }else{
//       const patients = dataListToTable as GETpatient[];
//       for(const data of patients){
//         dataListFormated.push({
//           id: data.id,
//           row: !!data?.priorityType?
//           [
//             data.priorityType as string,
//             getDateInSlashFormat(data.createdAt),
//             String(data.registerNumber),
//             data.fullname,
//             data.group,
//             data.accessType
//           ]:
//           [
//             getDateInSlashFormat(data.createdAt),
//             String(data.registerNumber),
//             data.fullname,
//             data.group,
//             data.accessType
//           ]
//         });
//       }
//     }
  
//     return dataListFormated;
//   }catch(e: unknown){
//     const err = e as Error;
//     console.log(err.message);
//     return [];
//   }
// }

// export function simpleFormater(rows: { id: string; name: string }[]){
//   const tableRows:TableRow[] = [];
//   for(const item of rows)
//     tableRows.push({
//       id: item.id,
//       row: [ item.name ]
//     });

//   return tableRows;
// }

// export function tableAppointments(appointments: ScheduleAppointment[]){
//   const tableRows:TableRow[] = [];
//   for(const item of appointments)
//     tableRows.push({
//       id: item.id,
//       row: [ 
//         item.hour,
//         item.patient,
//         item.doctor,
//         item.room,
//         item.status,
//       ]
//     });

//   return tableRows;
// }

// export function tableSugeries(sugeries: ScheduleSugery[]){
//   const tableRows:TableRow[] = [];
//   for(const item of sugeries)
//     tableRows.push({
//       id: item.id,
//       row: [
//         item.requestingService,
//         item.date, 
//         item.patient,
//         item.sugeryType,
//         item.infirmary,
//         item.bed,
//         item.doctor,
//         item?.status as string,
//       ]
//     });

//   return tableRows;
// }

// export function tableOperatingRoom(sugeries: ScheduleSugery[]){
//   const tableRows:TableRow[] = [];
//   for(const item of sugeries)
//     tableRows.push({
//       id: item.id,
//       row: [
//         item.requestingService,
//         item.date, 
//         item.patient,
//         item.sugeryType,
//         item.infirmary,
//         item.bed,
//         item.doctor,
//       ]
//     });

//   return tableRows;
// }

// export function tableLaboratory(laboratory: Services[]){
//   const tableRows:TableRow[] = [];
//   for(const item of laboratory)
//     tableRows.push({
//       id: item.id,
//       row: [ 
//         item.markedDatatime,
//         item.patient,
//         item.user,
//         item.nameLaboratory,
//       ]
//     });

//   return tableRows;
// }

// export function tableExternalUnit(appointments: ExternalUnit[]){
//   const tableRows:TableRow[] = [];
//   for(const item of appointments)
//     tableRows.push({
//       id: item.id,
//       row: [ 
//         item.name,
//         item.street,
//         item.municipality,
//         item.province,
//         item.user
//       ]
//     });

//   return tableRows;
// }

// export function tableOffice(data: DoctorOffice[]){
//   const tableRows:TableRow[] = [];
//   for(const item of data)
//     tableRows.push({
//       id: item.id,
//       row: [ 
//         item.markedDatatime,
//         item.patient,
//         item.user,
//         item.room,
//       ]
//     });

//   return tableRows;
// }

/*export function tableClinicalDiary(data: DiaryTypeProps[]){
  const dataClinicalDiary:TableRow[] = [];

    data?.medicineDiary.forEach((value, index) => {
        dataClinicalDiary.push({
          id: String(index),
          row: [
            value.date,
            value.description,
          ]
    })});
}*/

type FormaterData = { [index: string ]: string }

type FormaterOptions = {
  order?: string[]; 
  transform?: {
    targetKey: string;
    fn(arg: string): string
  },
  filterKey?: string[]; 
}

export function formater(data: unknown[], options?:FormaterOptions){
  try{
    const keys = [];
    const controller = new Map<string, null>();
    const rows = [];

    for (const key in data[0] as object){
      if(options?.filterKey?.length){
        if(!options.filterKey.includes(key))
          continue;

        keys.push(key);
      }else
        keys.push(key);
    }
     
    if(options?.order){
      if(options.order.includes("id"))
        throw new Error("não precisa adicionar a chave <id> !");
      
      if(options.order.length !== keys.slice(1).length)
        throw new Error("chaves em falta!\n".concat(JSON.stringify({ 
          original: {
            length: keys.length,
            comment: "menos 1 porque o id não se conta",
            keys
          }, 
          order: {
            length: options.order.length,
            keys: options.order
          } 
        }, null, 2))); 

      for(const k of options.order){
        if(!keys.slice(1).includes(k))
          throw new Error("a chave "+k+" não existe nos dados");
      }
    }

    if(options?.transform){
      if(!keys.slice(1).includes(options.transform.targetKey)){
        console.log("chaves validas: ", keys.slice(1));
        throw new Error(`a chave ${options.transform.targetKey} não existe!`); 
      }
    }
    
    const dataKeys = options?.order ??  keys.slice(1);

    if(!keys.includes("id")){
      throw new Error("a chave id não foi encontrado na estruturada de dados original");
    }
    
    for(const i of data as FormaterData[])
      for (const _ in i){
        const row = {
          id: i["id"],
          row: dataKeys.map(k => {
            if(options?.transform)
              if(options.transform.targetKey === k)
                return options.transform.fn(i[k]);

            return i[k];
          })
        };
        
        if(controller.has(row.id))
          continue;

        controller.set(row.id, null);
        rows.push(row);
      }

    return rows;
  } catch (e) {
    const err = e as Error;
    console.error(err.message);
    return [];
  }
}