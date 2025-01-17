// import Accordium from "@/components/accordium";
// import InputDetails from "@/components/ui/input-details";
// import Button from "@/components/ui/button";
// import InputField from "@/components/ui/input-field";

// export default function CardiopulmonaryMedicine(){
//   return(
//     <Accordium className="hover:bg-primary/35 bg-primary/40" title="MEDICINA CARDIOPULMUNAL">
//     <div className="flex flex-col gap-y-3">
//       <Accordium title="Dados do Paciente">
//         {''/*<PersonalOfficeForm
//           id={_id.toString()}
//           {...{fullname}}
//           {...{age}}
//           {...{gender}}
//         />*/}
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

//       <Accordium title="História da Doênça Actual(sinais e sintomas presentes)">
//         <div>
//           <div className="flex flex-col my-4">
//             <label className="text-sm font-medium">Sistema Cardiovascular</label>
//             <div className="flex w-24 flex-col">
//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Dor Torácica:</label>
//                 <InputField
//                   type="checkbox"
//                   name="chestPain"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Palpitações:</label>
//                 <InputField
//                   type="checkbox"
//                   name="palpitations"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Dispneia:</label>
//                 <InputField
//                   type="checkbox"
//                   name="dyspnea"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Edema:</label>
//                 <InputField
//                   type="checkbox"
//                   name="edema"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Síncope:</label>
//                 <InputField
//                   type="checkbox"
//                   name="syncope"
//                 />
//               </div>
//             </div>
//           </div>
          
//           <div className="my-4">
//             <InputDetails
//               rows={3}
//               textLabel="Duração dos Sinais e Sintomas Cardiovascular"
//               placeholder="Descreva"
//               name="durationOfSymptoms"
//               required
//             />
//           </div>

//           <div className="flex flex-col mt-6 mb-4">
//             <div className="flex items-center gap-x-4">
//               <label className="text-sm font-medium">Sistema Respiratório:</label>						
//               <div className="flex gap-x-2">
//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-sm">Produtiva</label>
//                   <InputField
//                     type="radio"
//                     name="productivity"
//                   />
//                 </div>

//                 <div className="flex gap-x-1 items-center">
//                   <label className="text-sm">Não produtiva</label>
//                   <InputField
//                     type="radio"
//                     name="productivity"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex w-32 flex-col">
//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Tosse</label>
//                 <InputField
//                   type="checkbox"
//                   name="cough"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Chiado no peito</label>
//                 <InputField
//                   type="checkbox"
//                   name="hissing"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Hemoptise</label>
//                 <InputField
//                   type="checkbox"
//                   name="hemoptysis"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 items-center gap-x-4">
//             <InputField
//               textLabel="Dor Torácica Pleurítica"
//               placeholder="Descreva"
//               name="chestPain"
//               required
//             />

//             <InputField
//               textLabel="Expectoração (características)"
//               placeholder="Descreva"
//               name="features"
//               required
//             />
//           </div>

//           <InputDetails
//             rows={3}
//             textLabel="Duração dos Sinais e Sintomas Respiratório"
//             placeholder="Descreva"
//             name="durationOfSymptoms"
//             required
//           />

//           <div>
//             <Button>Salvar</Button>
//           </div>
//         </div>
//       </Accordium>

//       <Accordium title="Exame Físico">
//         <div>
//           <div className="grid grid-cols-3 items-center gap-x-2">
//             <InputField
//               textLabel="Estado geral"
//               placeholder="Descreva"
//               name="generalCondition"
//               required
//             />

//             <InputField
//               textLabel="Postura"
//               placeholder="Descreva"
//               name="posture"
//               required
//             />

//             <InputField
//               textLabel="Clanose"
//               placeholder="Descreva"
//               name="clanosis"
//               required
//             />

//             <InputField
//               textLabel="Edema"
//               placeholder="Descreva"
//               name="edema"
//               required
//             />

//             <InputField
//               textLabel="Inspeção e palpação do precórdio"
//               placeholder="Descreva"
//               name="inspect"
//               required
//             />

//             <InputField
//               textLabel="Ausculta Cardíaca"
//               placeholder="ritmo, sopros, bulhas"
//               name="cardiacAuscultation"
//               required
//             />

//             <InputField
//               textLabel="Pulso"
//               placeholder="frequência, amplitude, ritmo"
//               name="pulse"
//               required
//             />

//             <InputField
//               textLabel="Inspeção do tórax"
//               placeholder="simetria, defomidades"
//               name="chestInspection"
//               required
//             />

//             <InputField
//               textLabel="Palpação"
//               placeholder="Descreva"
//               name="palpation"
//               required
//             />

//             <InputField
//               textLabel="Percussão"
//               placeholder="Descreva"
//               name="percussion"
//               required
//             />
//           </div>

//           <InputDetails
//             rows={3}
//             textLabel="Ausculta pulmonar"
//             placeholder="murmúrios vesiculares, estertores, roncos, sibilos"
//             name="durationOfSymptoms"
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
//             placeholder="Descrever os resultados e aspectos observados"
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

//       <Accordium title="Antecedentes Pessoais">
//         <div>
//           <div className="flex flex-col my-4">
//             <label className="text-sm font-medium">Doênças prévias</label>
//             <div className="flex w-36 flex-col"> 
//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Hipertensão:</label>
//                 <InputField
//                   type="checkbox"
//                   name="hypertension"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Insufiência Cardíaca:</label>
//                 <InputField
//                   type="checkbox"
//                   name="heartFailure"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Infarto:</label>
//                 <InputField
//                   type="checkbox"
//                   name="heartAttack"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Asma:</label>
//                 <InputField
//                   type="checkbox"
//                   name="asthma"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Tuberculose:</label>
//                 <InputField
//                   type="checkbox"
//                   name="tuberculosis"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">DPOC:</label>
//                 <InputField
//                   type="checkbox"
//                   name="DPOC"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 items-center gap-x-2">
//             <InputField
//               textLabel="Outra"
//               placeholder="Descreva"
//               name="otherDisease"
//               required
//             />

//             <InputField
//               textLabel="Cirurgia Pré-existente"
//               placeholder="Descreva"
//               name="surgeries"
//               required
//             />

//             <InputField
//               type="date"
//               textLabel="Data da Cirurgia"
//               name="surgeryDate"
//               required
//             />

//             <InputField
//               textLabel="Outras Complicações"
//               placeholder="Descreva"
//               name="otherComplications"
//               required
//             />

//             <InputField
//               textLabel="Internamentos Anteriores"
//               placeholder="Descreva"
//               name="previousHospitalizations"
//               required
//             />

//             <InputField
//               textLabel="Motivo"
//               placeholder="Descreva"
//               name="reason"
//               required
//             />

//             <InputField
//               type="date"
//               textLabel="Data"
//               name="date"			
//             />

//             <InputField
//               textLabel="Alergias"
//               placeholder="Descreva"
//               name="allergies"
//               required
//             />

//             <InputField
//               textLabel="Agente reativo"
//               placeholder="Descreva"
//               name="reactiveAgent"
//               required
//             />
//           </div>
//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Antecedentes Familiares">
//         <div>
//           <div className="flex flex-col my-4">
//             <label className="text-sm font-medium">Doênças na família</label>
//             <div className="flex w-40 flex-col">
//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Infarto:</label>
//                 <InputField
//                   type="checkbox"
//                   name="heartAttack"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Hipertensão:</label>
//                 <InputField
//                   type="checkbox"
//                   name="hypertension"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Insuficiência Cardíaca:</label>
//                 <InputField
//                   type="checkbox"
//                   name="heartFailure"
//                 />
//               </div>

//               <div className="flex gap-x-1 items-center justify-between">
//                 <label className="text-xs font-medium">Câncer do pulmão</label>
//                 <InputField
//                   type="checkbox"
//                   name="lungCancer"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="w-96">
//             <InputField
//               textLabel="Outras"
//               placeholder="Descreva"
//               name="otherDisease"
//               required
//             />
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Hábitos de Vida">
//         <div>
//           <div className="grid grid-cols-3 items-center gap-x-2">
//             <InputField
//               textLabel="Tabagismo"
//               placeholder="Descreva"
//               name="smoking"
//               required
//             />

//             <InputField
//               textLabel="Tempo de uso"
//               placeholder="Descreva"
//               name="timeOfUse"
//               required
//             />

//             <InputField
//               textLabel="Tentativas de cessação"
//               placeholder="Descreva"
//               name="timeOfUse"
//               required
//             />

//             <InputField
//               textLabel="Consumo de bebidas alcoólica"
//               placeholder="Descreva"
//               name="alcoholConsumption"
//               required
//             />

//             <InputField
//               textLabel="Tipo de bebida"
//               placeholder="Descreva"
//               name="typeOfDrink"
//               required
//             />

//             <InputField
//               textLabel="Frequência"
//               placeholder="Descreva"
//               name="frequency"
//               required
//             />

//             <InputField
//               textLabel="Actividade física"
//               placeholder="Descreva"
//               name="physicalActivity"
//               required
//             />

//             <InputField
//               textLabel="Tipos"
//               placeholder="Descreva"
//               name="types"
//               required
//             />

//             <InputField
//               textLabel="Duração"
//               placeholder="Descreva"
//               name="duration"
//               required
//             />

//             <InputField
//               textLabel="Regime Alimentar"
//               placeholder="Descreva"
//               name="diet"
//               required
//             />

//             <InputField
//               textLabel="Comida habitual"
//               placeholder="Descreva"
//               name="usualFood"
//               required
//             />

//             <InputField
//               type="number"
//               textLabel="Nª de refeições dia"
//               placeholder="Descreva"
//               name="numberOfMeals"
//               required
//             />
//           </div>

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Plano de Tratamento e Cuidados">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Plano de Tratamento e Cuidados"
//             placeholder="Descreva"
//             name="treatmentAndCare"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>

//       <Accordium title="Objectivos do Plano de Tratamento e Cuidados">
//         <div>
//           <InputDetails
//             rows={3}
//             textLabel="Objectivos do Plano de Tratamento e Cuidados"
//             placeholder="Descreva"
//             name="treatmentAndCareGoals"
//             required
//           />

//           <Button>Salvar</Button>
//         </div>
//       </Accordium>
//     </div>
//   </Accordium>
//   );
// }