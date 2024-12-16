import Accordium from "@/components/accordium";
//import { SimpleTable } from "@/components/CCG";
import Header from "@/components/header";
//import { simpleFormater } from "@/lib/table-formater";
//import { getCCGs, getExam, getExamResults, schedulePatientExam } from "@/app/backend/api/clinical/scheduling-api";
import { scheduleExamModel } from "@/app/backend/models/clinical";

export default async function Page({
  params
}:{
  params: Promise<{
    patientId:string;
  }>
}){
  const { patientId } = await params;
  const categories = await scheduleExamModel.find({patientId});

  /*const data = async (id:string)=>{
    for(let value of resultExam){
      for(let exam of value.exams){
        let { categoryId } = await getExam(exam.toString());
        if(id === categoryId){
          let result= await getExamResult(value._id.toString())
          return <Card>
              <div>
              <SubTitle className="inline-flex mt-3">Informações do Resultado</SubTitle>           
          
              <TitleAndSubtitle
                label="Reultado do exame"
                value={result?.detail as string} 
              />
            </div>
          </Card>
        }
      }
    }
  }  */

  return(
    <div className="flex flex-col gap-3 mb-8 mt-4">
      <Header title="Tipos de exame" />
      {
        categories.map((val, index)=>{
          return <Accordium key={index} title={'val'}>
                  Exemplo
                </Accordium>
        })
      }
    </div>
  );
}