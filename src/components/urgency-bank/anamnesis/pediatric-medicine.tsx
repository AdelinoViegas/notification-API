// import Accordium from "@/components/accordium";
// import InputDetails from "@/components/ui/input-details";
// import Button from "@/components/ui/button";
// import InputField from "@/components/ui/input-field";
// import { patientData } from "@/app/(erp-modules)/clinical/urgency-bank/[patientId]/anamnesis/page";
// import PersonalOfficeForm from "@/components/forms/signed-patient/personal-office-form";

// export default function PediatricMedicine({
//   _id,
//   fullname,
//   age,
//   gender,
// }:patientData){
//   return(
//     <Accordium className="hover:bg-primary/35 bg-primary/40" title="MEDICINA PEDRIÁTICA">
//     <div className="flex flex-col gap-y-3">
//         <Accordium title="Dados do Paciente">
//           <PersonalOfficeForm
//             {...{_id}}
//             {...{fullname}}
//             {...{age}}
//             {...{gender}}
//           />
//         </Accordium>

//         <Accordium title="Queixa Principal">
//           <div>
//             <InputDetails
//               rows={3}
//               textLabel="Queixa Principal"
//               placeholder="Descreva"
//               name="mainComplaint"
//               required
//             />
//             <div>
//               <Button>Salvar</Button>
//             </div>
//           </div>
//         </Accordium>

//         <Accordium title="História da Doênça Actual(Sinais e sintomas presentes)">
//           <div className="flex flex-col gap-y-4">
//             <InputDetails
//               rows={3}
//               textLabel="Sinais e Sintomas(início, duração, evolução, intensidade, outros aspectos associados aos sinais e sintomas)"
//               placeholder="Descreva"
//               name="symptoms"
//               required
//             />

//             <InputDetails
//               rows={3}
//               textLabel="Tratamento Prévio(descrever tratamento feitos para as queixas actuais, e resultados)"
//               placeholder="Descreva"
//               name="previousTreatment"
//               required
//             />

//             <div>
//               <Button>Salvar</Button>
//             </div>
//           </div>
//         </Accordium>

//         <Accordium title="Exames Complementares">
//           <div>	
//             <InputDetails
//               rows={3}
//               textLabel="Exames Complementares"
//               placeholder="Descrever os resultados dos exames, aspectos fundamentais observados"
//               name="complementaryExams"
//               required
//             />
            
//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Exame Físico e Avialação dos Orgãos Vitais">
//           <div>
//             <InputDetails
//               rows={3}
//               textLabel="Exame Físico e Avialação dos Orgãos Vitais"
//               placeholder="Descreva"
//               name="physicalExamination"
//               required
//             />

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>
        
//         <Accordium title="Hipótese de Diagnóstico">
//           <div>
//             <InputDetails
//               rows={3}
//               textLabel="Hipótese de Diagnóstico"
//               placeholder="Descreva"
//               name="diagnosticHypothesis"
//               required
//             />
//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Antecedentes Pessoais">
//           <div>
//             <div className="grid grid-cols-4 items-center gap-x-2">

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium">Tipo de parto</label>
//                 <div className="flex gap-x-4">
//                   <div className="flex gap-x-1 items-center">
//                     <label className="text-sm">Normal</label>
//                     <InputField
//                       type="radio"
//                       name="typeOfDelivery"
//                     />
//                   </div>

//                   <div className="flex gap-x-1 items-center">
//                     <label className="text-sm">Cesariana</label>
//                     <InputField
//                       type="radio"
//                       name="typeOfDelivery"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <InputField
//                 type="number"
//                 textLabel="Idade gestacional"
//                 placeholder="Digite o valor"
//                 name="gestational age"
//                 required
//               />

//               <InputField
//                 type="number"
//                 textLabel="Peso ao Nascer (kg)"
//                 placeholder="Digite o valor"
//                 name="birthWeight"
//                 required
//               />

//               <InputField
//                 type="number"
//                 textLabel="Altura ao Nascer"
//                 placeholder="Digite o valor"
//                 name="birthHeight"
//                 required
//               />	
//             </div>

//             <InputDetails
//               rows={3}
//               textLabel="Desenvolvimento Neuropsicomotor"
//               placeholder="descrever aspectos relevantes sobre o desenvolvimento da criança"
//               name="diagnosticHypothesis"
//               required
//             />

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Alimentação">
//           <div>
//             <div className="grid grid-cols-3 items-center gap-x-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium">Aleitamento materno</label>
//                 <div className="flex gap-x-4">
//                   <div className="flex gap-x-1 items-center">
//                     <label className="text-sm">Sim</label>
//                     <InputField
//                       type="radio"
//                       name="response"
//                     />
//                   </div>

//                   <div className="flex gap-x-1 items-center">
//                     <label className="text-sm">Não</label>
//                     <InputField
//                       type="radio"
//                       name="response"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <InputField
//                 textLabel="Razões"
//                 placeholder="Descreva"
//                 name="birthHeight"
//                 required
//               />

//               <InputField
//                 textLabel="Alimentação Complementar"
//                 placeholder="Descreva"
//                 name="complementaryFeeding"
//                 required
//               />
              
//               <InputField
//                 textLabel="Tipo"
//                 placeholder="Descreva"
//                 name="type"
//                 required
//               />

//               <InputField
//                 textLabel="Inicio da Alimentação Complementar"
//                 placeholder="Descreva a idade"
//                 name="startOfComplementaryFeeding"
//                 required
//               />

//               <InputField
//                 textLabel="Resultados Visíveis"
//                 placeholder="Descreva"
//                 name="visibleResults"
//                 required
//               />
//             </div>

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Imunização">
//           <div>
//             <div className="grid grid-cols-3 items-center gap-x-2">
//               <InputField
//                 textLabel="Vacina Recebida"
//                 placeholder="Descreva"
//                 name="vaccineReceived"
//                 required
//               />

//               <InputField
//                 type="date"
//                 textLabel="Data"
//                 name="date"
//                 required
//               />
            
//               <InputField
//                 textLabel="Reação"
//                 placeholder="Descreva"
//                 name="reaction"
//                 required
//               />
//             </div>

//             <InputDetails
//               rows={3}
//               textLabel="Doênças Anteriores"
//               placeholder="Descrever infecções, alergias, internamentos, cirurgias, duração, resultados"
//               name="previousIllnesses"
//               required
//             />

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Antecedentes Familiares">
//           <div>
//             <InputDetails
//               rows={3}
//               textLabel="Doênças Familiares"
//               placeholder="Descrever infecções, alergias, internamentos, cirurgias, duração, resultados"
//               name="familyDiseases"
//               required
//             />

//             <InputDetails
//               rows={3}
//               textLabel="Condição de Saúde dos País e Irmão"
//               placeholder="Descreva as doênças dos seus parentes"
//               name="healthConditions"
//               required
//             />

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Condição de Vida e Ambiente Familiar">
//           <div>
//             <div className="grid grid-cols-2 items-center gap-x-2">
//               <InputField
//                 textLabel="Condições da Moradia"
//                 placeholder="Descreva"
//                 name="housingConditions"
//                 required
//               />
            
//               <InputField
//                 textLabel="Processo de Higiene e Saneamento"
//                 placeholder="Descreva"
//                 name="hygieneProcess"
//                 required
//               />

//               <InputField
//                 textLabel="Presença de Animal Doméstico"
//                 placeholder="Descreva"
//                 name="presenceOfAnimal"
//                 required
//               />
            
//               <InputField
//                 textLabel="Fonte de Renda dos Pais"
//                 placeholder="Descreva"
//                 name="sourceOfIncome"
//                 required
//               />
//             </div>

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Outros">
//           <div>
//             <InputDetails
//               rows={3}
//               textLabel="Outros"
//               placeholder="Descreva"
//               name="others"
//               required
//             />

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>

//         <Accordium title="Internamento">
//           <div>
//             <InputDetails
//               rows={3}
//               textLabel="Motivo do Internamento"
//               placeholder="Descreva"
//               name="detail"
//               required
//             />

//             <div className="grid grid-cols-3 gap-x-4">
//               <InputField
//                 type="date"
//                 textLabel="Data do Internamento"
//                 name="duration"
//                 required
//               />

//               <InputField
//                 type="time"
//                 textLabel="Hora"
//                 name="duration"
//                 required
//               />				

//               <InputField
//                 textLabel="Estado ao Internar"
//                 placeholder="descreva"
//                 name="duration"
//                 required
//               />
//             </div>

//             <Button>Salvar</Button>
//           </div>
//         </Accordium>
//       </div>
//     </Accordium>
//   );
// }