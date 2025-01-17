// import Accordium from "@/components/accordium";
// import InputDetails from "@/components/ui/input-details";
// import Button from "@/components/ui/button";
// import InputField from "@/components/ui/input-field";
// import { patientData } from "@/app/(erp-modules)/clinical/urgency-bank/[patientId]/anamnesis/page";
// import PersonalOfficeForm from "@/components/forms/signed-patient/personal-office-form";

// export default function PhisicalMedicine({
//   _id,
//   fullname,
//   age,
//   gender,
// }:patientData){
//   return(
//     <Accordium className="hover:bg-primary/35 bg-primary/40" title="MEDICINA FÍSICA E REABILITAÇÃO">
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
//             placeholder="Descreva a principal queixa"
//             name="mainComplaint"
//             required
//           />
//           <div>
//             <Button>Salvar</Button>
//           </div>
//         </div>
//       </Accordium>

//       <Accordium title="História da Doênça Actual">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="História da Doênça Actual"
//             placeholder="Descreva os sintomas actuais, duração, factores agravantes/aliviantes, entre outros"
//             name="symptoms"
//             required
//           />
          
//           <Button>Salvar</Button>								
//         </div>
//       </Accordium>

//       <Accordium title="Exame Físico">
//         <div>
//           <div className="grid grid-cols-3 gap-x-2">
//             <InputField
//               textLabel="Postura"
//               placeholder="Descreva"
//               name="posture"
//               required
//             />

//             <InputField
//               textLabel="Marcha"
//               placeholder="Descreva"
//               name="march"
//               required
//             />		

//             <InputField
//               textLabel="Tônus Muscular"
//               placeholder="Descreva"
//               name="muscleTone"
//               required
//             />

//             <InputField
//               textLabel="Força Muscular"
//               placeholder="Descreva"
//               name="muscleStrength"
//               required
//             />	

//             <InputField
//               textLabel="Reflexos"
//               placeholder="Descreva"
//               name="reflexes"
//               required
//             />

//             <InputField
//               textLabel="Sensibilidade"
//               placeholder="Descreva"
//               name="sensitivity"
//               required
//             />

//             <InputField
//               textLabel="Mobilidade Articular"
//               placeholder="Descreva"
//               name="joinMobility"
//               required
//             />
//           </div>

//           <div className="flex flex-col w-short my-4">
//             <div className="flex items-center gap-x-4">
//               <label className="text-sm font-medium">Tem dor:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="plain"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="plain"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex gap-x-1 items-center">
//                 <label className="text-xs">Local</label>
//                 <InputField
//                   placeholder="Descreva"
//                   name="local"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col w-short my-4">
//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Tem dor:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Leve</label>
//                   <InputField
//                     type="radio"
//                     name="degreeOfPlain"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Forte</label>
//                   <InputField
//                     type="radio"
//                     name="degreeOfPlain"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">M/forte</label>
//                   <InputField
//                     type="radio"
//                     name="degreeOfPlain"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Exames Complementares">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Exames Complementares"
//             placeholder="Descrever os resultados dos exames, aspectos fundamentais observados"
//             name="complementaryExams"
//             required
//           />
//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Hipótese de Diagnóstico">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Hipótese de Diagnóstico"
//             placeholder="Descreva"
//             name="diagnosticHypothesis"
//             required
//           />
          
//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Antecedentes Pessoais Patológicos(Doênças pré-existentes, hospitalizações, acidentes)">
//         <div>
//           <div className="flex flex-col w-short">
//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Diabete:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="diabetes"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="diabetes"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Hipertensão:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="hypertension"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="hypertension"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Doênças Respiratórias:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="respiratoryDiseases"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="respiratoryDiseases"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Tuberculose:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="tuberculosis"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="tuberculosis"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Malária:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="malaria"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="malaria"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <InputDetails
//             rows={3}
//             textLabel="Outros"
//             placeholder="Descreva"
//             name="others"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>
      
//       <Accordium title="Estilo de Vida e Hábitos">
//         <div>
//           <div className="flex gap-x-4 items-center my-6">
//             <label className="text-sm font-medium">Consumo de Tabaco:</label>
//             <div className="flex gap-x-4">
//               <div className="flex gap-x-1 items-center">
//                 <label className="text-xs">Fumante</label>
//                 <InputField
//                   type="radio"
//                   name="tobaccoConsumption"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center">
//                 <label className="text-xs">Não Fumante</label>
//                 <InputField
//                   type="radio"
//                   name="tobaccoConsumption"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center">
//                 <label className="text-xs">Ex-Fumante</label>
//                 <InputField
//                   type="radio"
//                   name="tobaccoConsumption"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col my-6">
//             <div className="flex items-center gap-x-4">
//               <label className="text-sm font-medium">Consumo de Álcool:</label>						
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Consome</label>
//                   <InputField
//                     type="radio"
//                     name="alcohol"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não Consome</label>
//                   <InputField
//                     type="radio"
//                     name="alcohol"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Ex-consumidor</label>
//                   <InputField
//                     type="radio"
//                     name="alcohol"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-x-4">
//               <div className="flex flex-col">
//                 <label className="text-xs -mb-3">Frequência</label>
//                 <InputField
//                   placeholder="descreva"
//                   name="frequency"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-xs -mb-3">Quantidade</label>
//                 <InputField
//                   type="number"
//                   placeholder="Digite o valor"
//                   name="amount"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col my-6">
//             <div className="flex items-center gap-x-4">
//               <label className="text-sm font-medium">Actividade Física:</label>																			
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Praticante</label>
//                   <InputField
//                     type="radio"
//                     name="physical"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não praticante</label>
//                   <InputField
//                     type="radio"
//                     name="physical"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-x-4">
//               <div className="flex flex-col">
//                 <label className="text-xs -mb-3">Tipo de Actividade Física</label>
//                 <InputField
//                   placeholder="descreva"
//                   name="activity"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-xs -mb-3">Frequência</label>
//                 <InputField
//                   placeholder="descreva"
//                   name="frequency"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-xs -mb-3">Tempo de actividade por secção</label>
//                 <InputField
//                   placeholder="descreva"
//                   name="alcohol"
//                 />
//               </div>
//             </div>				
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Antecedentes Familiares (Doênças relevantes na família)">
//         <div>
//           <div className="w-64">
//             <div className="flex gap-x-4 items-center justify-between my-6">
//               <label className="text-sm font-medium">Há histórico familiar de doênças relevantes?:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="relevantDiseases"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="relevantDiseases"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-x-4 items-center justify-between my-6">
//               <label className="text-sm font-medium">Doênças Cardiovasculares:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="cardiovascularDiseases"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="cardiovascularDiseases"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-x-4 items-center justify-between my-6">
//               <label className="text-sm font-medium">Doênças Respiratórias:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="repiratoryDiseases"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="repiratoryDiseases"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-x-4 items-center justify-between my-6">
//               <label className="text-sm font-medium">Doênças Osteomusculares:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="musculoskeletalDiseases"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="musculoskeletalDiseases"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-x-4 items-center justify-between my-6">
//               <label className="text-sm font-medium">Doênças Neurológicas:</label>
//               <div className="flex gap-x-4">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Sim</label>
//                   <InputField
//                     type="radio"
//                     name="neurologicalDiseases"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-xs">Não</label>
//                   <InputField
//                     type="radio"
//                     name="neurologicalDiseases"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <InputDetails
//             rows={3}
//             textLabel="outros"
//             placeholder="Descreva" 
//             name="others"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Plano Terapêutico">
//         <div>							
//           <div className="w-40">
//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs">Reabilitação Física: </label>
//               <InputField
//                 type="checkbox"
//                 name="physicalRehabilitation"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs">Fisioterapia:</label>
//               <InputField
//                 type="checkbox"
//                 name="physiotherapy"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs">Terapia Ocupacional:</label>
//               <InputField
//                 type="checkbox"
//                 name="occupationalTherapy"
//               />
//             </div>

//             <div className="flex gap-x-1 items-center justify-between">
//               <label className="text-xs">Uso de órteses/próteses:</label>
//               <InputField
//                 type="checkbox"
//                 name="orthosis/prosthesis"
//               />
//             </div>
//           </div>
         
//           <div className="grid grid-cols-2 gap-x-4">
//             <InputField
//                 textLabel="Indicação de Acompanhamento por outras Especialidades"
//                 name="otherSpecialties"
//                 placeholder="Descreva"
//                 required
//             />

//             <InputField
//                 textLabel="Medicamentos"
//                 name="medicines"
//                 placeholder="Descreva"
//                 required
//             />
//           </div>

//           <InputDetails
//             rows={3}
//             textLabel="Outros"
//             placeholder="Descreva"
//             name="others"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>	

//       <Accordium title="Objectivo do Plano Terapêutico">
//         <div>				
//           <InputDetails
//             rows={3}
//             textLabel="Objectivo do Plano Terapêutico"
//             placeholder="Descreva"
//             name="signsOfVitalOrgans"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Internamento">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Motivo do Internamento"
//             placeholder="Descreva"
//             name="detail"
//             required
//           />

//           <div className="grid grid-cols-3 gap-x-4">
//             <InputField
//               type="date"
//               textLabel="Data do Internamento"
//               name="dateOfAdmission"
//               required
//             />

//             <InputField
//               type="time"
//               textLabel="Hora"
//               name="hour"
//               required
//             />				

//             <InputField
//               textLabel="Estado ao Internar"
//               placeholder="descreva"
//               name="condition"
//               required
//             />
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>
//     </div>
//   </Accordium>
//   );
// }