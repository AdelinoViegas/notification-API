// import Accordium from "@/components/accordium";
// import InputDetails from "@/components/ui/input-details";
// import Button from "@/components/ui/button";
// import InputField from "@/components/ui/input-field";
// import { patientData } from "@/app/(erp-modules)/clinical/urgency-bank/[patientId]/anamnesis/page";
// import PersonalOfficeForm from "@/components/forms/signed-patient/personal-office-form";

// export default function OphthalmologyService({
//   _id,
//   fullname,
//   age,
//   gender,
// }:patientData){
//   return(
//     <Accordium className="hover:bg-primary/35 bg-primary/40" title="SERVIÇO DE OFTALMOLOGIA">
//     <div className="flex flex-col gap-y-3">
//       <Accordium title="Dados do Paciente">
//         <PersonalOfficeForm
//           {...{_id}}
//           {...{fullname}}
//           {...{age}}
//           {...{gender}}
//         />
//       </Accordium>

//       <Accordium title="Queixa Principal">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Queixa Principal"
//             placeholder="Descreva"
//             name="mainComplaint"
//             required
//           />
//           <div>
//             <Button>Salvar</Button>
//           </div>
//         </div>
//       </Accordium>

//       <Accordium title="História da Doênça Actual(Sinais e sintomas presentes)">
//         <div>
//           <div className="flex flex-col w-32 my-4">
//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs font-medium">Dor:</label>
//               <InputField
//                 type="checkbox"
//                 name="pain"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs font-medium">Vermelhidão:</label>
//               <InputField
//                 type="checkbox"
//                 name="redness"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs font-medium">Lacrimejamento:</label>
//               <InputField
//                 type="checkbox"
//                 name="tearing"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs font-medium">Fotofobia:</label>
//               <InputField
//                 type="checkbox"
//                 name="photophobia"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs font-medium">Secreção:</label>
//               <InputField
//                 type="checkbox"
//                 name="secretion"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs font-medium">Visão Embaçada:</label>
//               <InputField
//                 type="checkbox"
//                 name="blurredVision"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 items-center gap-x-4">
//             <InputField
//               textLabel="Outros"
//               placeholder="Descreva"
//               name="others"
//               required
//             />

//             <InputField
//               textLabel="Progressão dos Sinais e Sintomas"
//               placeholder="Descrever tratamentos, feitos para as queixas actuais, e resultados"
//               name="progressionOfSymptoms"
//               required
//             />
//           </div>									

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Exames Físicos Oculares">
//         <div>	
//           <div className="grid grid-cols-2 items-center gap-x-4">
//             <InputField
//               textLabel="Acuidade Visual (OD, OE, CC, SC)"
//               placeholder="Descreva"
//               name="visualAcuity"
//               required
//             />

//             <InputField
//               textLabel="Tonometria"
//               placeholder="Descreva"
//               name="tonometry"
//               required
//             />

//             <InputField
//               textLabel="Motilidade Ocular"
//               placeholder="Descreva"
//               name="ocularMotility"
//               required
//             />

//             <InputField
//               textLabel="Reflexos Pupilares"
//               placeholder="Descreva"
//               name="popullaryReflexes"
//               required
//             />
//           </div>

//           <InputDetails
//             rows={3}
//             textLabel="Biomicroscopia"
//             placeholder="pálpebras, conjuntiva, cómea, câmara anterior, íris, cristalino"
//             name="biomicroscopy"
//             required
//           />

//           <InputDetails
//             rows={3}
//             textLabel="Fundoscopia"
//             placeholder="papila ótica, retina, mácula, vasos"
//             name="fundoscopy"
//             required
//           />
        
//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Exames Complementares">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Exames Complementares"
//             placeholder="Descrever os resultados dos exames, aspectos, fundamentos observados"
//             name="complementaryExams"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>
      
//       <Accordium title="Hipótese de Diagnóstico/Diagnóstico Diferencial">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Hipótese de Diagnóstico/Diagnóstico Diferencial"
//             placeholder="Descreva"
//             name="diagnosis"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Antecedentes Pessoais">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Doênças Sistêmicas"
//             placeholder="diabetes, hipertensão, doênças autoimunes, outras"
//             name="systemicDiseases"
//             required
//           />
            
//           <InputDetails
//             rows={3}
//             textLabel="Doênças Oculares Prévias"
//             placeholder="glaucoma, catarata, deslocamento de retina, outra"
//             name="eyeDiseases"
//             required
//           />

//           <div className="grid grid-cols-3 items-center gap-x-2">
//             <InputField
//               textLabel="Cirurgias Oculares Prévias"
//               placeholder="Descreva"
//               name="eyeSurgeries"
//               required
//             />

//             <InputField
//               type="date"
//               textLabel="Data"
//               name="date"
//               required
//             />

//             <InputField
//               textLabel="Uso de Óculos ou Lentes de Contato"
//               placeholder="Descreva"
//               name="birthHeight"
//               required
//             />

//             <InputField
//               textLabel="Tipo de Correção"
//               placeholder="Descreva"
//               name="typeOfCorrection"
//               required
//             />

//             <InputField
//               textLabel="Tempo de Uso"
//               placeholder="Descreva"
//               name="timeOfUse"
//               required
//             />

//             <InputField
//               textLabel="Resultados Obtidos"
//               placeholder="Descreva"
//               name="resultsObtained"
//               required
//             />

//             <InputField
//               textLabel="Alergias Ocular"
//               placeholder="Descreva"
//               name="eyeAllergies"
//               required
//             />
            
//             <InputField
//               textLabel="Agente Reativo"
//               placeholder="Descreva"
//               name="reactiveAgent"
//               required
//             />

//             <InputField
//               textLabel="Outros"
//               placeholder="Descreva"
//               name="others"
//               required
//             />		
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Antecedentes Familiares">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Doênças Oculares na Família"
//             placeholder="glaucoma, degeneração, macular, retinite pigmentosa, outras"
//             name="eyesDiseases"
//             required
//           />
          
//           <InputDetails
//             rows={3}
//             textLabel="Doênças Sistêmicas na Família"
//             placeholder="diabetes, hipertensão, doênças autoimunes, outras"
//             name="systemicDiseases"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="História Social">
//         <div>					
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">Hábitos de vida</label>
//             <div className="flex w-24 flex-col">
//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">tabagismo:</label>
//                 <InputField
//                   type="checkbox"
//                   name="smoking"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">estilismo:</label>
//                 <InputField
//                   type="checkbox"
//                   name="style"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">drogas:</label>
//                 <InputField
//                   type="checkbox"
//                   name="drugs"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 items-center gap-x-4">
//             <InputField
//               textLabel="Exposição Ocupacional a Riscos Oculares"
//               placeholder="Descreva"
//               name="eyeRisks"
//               required
//             />

//             <InputField
//               textLabel="Actividades de Lazer que possam Afectar a Visão"
//               placeholder="Descreva"
//               name="leisureActivities"
//               required
//             />
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Revisão de Sistemas">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Sintomas Gerais"
//             placeholder="febre, perda de peso, outro"
//             name="generalSymptoms"
//             required
//           />

//           <InputDetails
//             rows={3}
//             textLabel="Sintomas Neurológicos"
//             placeholder="cefaleia, tontura, outro"
//             name="neurologicalSymptoms"
//             required
//           />

//           <InputDetails
//             rows={3}
//             textLabel="Sintomas Cardiovasculares"
//             placeholder="Descreva"
//             name="cardiovascularSymptoms"
//             required
//           />

//           <InputDetails
//             rows={3}
//             textLabel="Sintomas Respiratórios"
//             placeholder="Descreva"
//             name="respiratorySymptoms"
//             required
//           />

//           <InputDetails
//             rows={3}
//             textLabel="Sistomas Gastrointestinais"
//             placeholder="Descreva"
//             name="gastrointestinalSymptoms"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Plano Terapêutico e de Cuidados">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Plano Terapêutico e de Cuidados"
//             placeholder="Descreva"
//             name="therapyAndCare"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Objectivos do Plano Terapêutico e dos Cuidados">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Objectivos do Plano Terapêutico e dos Cuidados"
//             placeholder="Descreva"
//             name="goalOfTherapyAndCare"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>
//     </div>
//   </Accordium>
//   );
// }