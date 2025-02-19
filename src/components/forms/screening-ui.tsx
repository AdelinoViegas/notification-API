"use client";

import { 
  useState,
  useEffect, 
  useActionState
} from "react";

import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import Selection, {  } from "@/components/ui/selection";
import InputField from "@/components/ui/input-field";
import { priorityToComponent } from "@/app/backend/api/clinical/translator";
import { insertScreening, getScreening } from "@/app/backend/api/clinical/api";
import { toast } from "react-toastify";

const initialState = { 
  message: "",
  status: false
}

export type UIComponent = "reason" | "vital-signals" | "state" | "priority" | "advice" | "all";
type Screening = {
  reason: string;
  advice: string;
  priority: string;
  state: string;
  vitalSignals: {
    paMax: number;
    paMin: number;
    jump: number;
    pvc: number;
    imc: number;
    sp02: number;
    temperature: number;
    breathing: number;
    weight: number;
    height: number;
    bloodGlucose: number;
  };
}

export default function ScreeningUI({
  ui,
  patientId
}:{
  ui: UIComponent,
  patientId: string;
}){
  const [ state, action ] = useActionState(insertScreening, initialState);
  const [ screeningData, setScreeningData ] = useState<Screening>();
  const [ editable, setEditable ] = useState(false);

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message);
      else
        toast.error(state.message);
    }

    getScreening(patientId)
    .then(data => setScreeningData(data as Screening))
    .finally(()=>setEditable(false))
  }, [state, patientId]);

  return(
    <div>
      <form action={action} className="py-3">
        <input type="hidden" name="t" value={ui} />
        <input type="hidden" name="Id" value={patientId} />

        {ui === "reason" && 
          <>
            <InputDetails
              textLabel="Escreva na caixa de Texto"
              placeholder="Descreva o motivo da vinda do utente..."
              name="reason"
              defaultValue={screeningData?.reason}
              disabled={!editable}
              required
            />
          </>
        }

        {ui === "vital-signals" && 
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <InputField
                type="number"
                textLabel="P.A MÁXIMA (mmHG)"
                name="paMax" 
                placeholder="0 (mmHG)"
                defaultValue={screeningData?.vitalSignals?.paMax}
                disabled={!editable}
              />

              <InputField
                type="number"
                textLabel="P.A MÍNIMA (mmHG)"
                name="paMin" 
                placeholder="0 (mmHG)"
                defaultValue={screeningData?.vitalSignals?.paMin}
                disabled={!editable}
              />
              
              <InputField
                type="number"
                textLabel="PULSO (BPM)"
                name="jump" 
                placeholder="0 (BPM)"
                required
                defaultValue={screeningData?.vitalSignals?.jump}
                disabled={!editable}
              />

              <InputField
                type="number"
                step={0.01}
                textLabel="TEMPERATURA (°)"
                name="temperature"
                required 
                placeholder="0 graus(°)"
                defaultValue={screeningData?.vitalSignals?.temperature}
                disabled={!editable}
              />

              <InputField
                type="number"
                textLabel="RESPIRAÇÂO (IRPM)"
                name="breathing" 
                required
                placeholder="0 (IRPM)"
                defaultValue={screeningData?.vitalSignals?.breathing}
                disabled={!editable}
              />

              <InputField
                type="number"
                textLabel="PESO (kg)"
                name="weight" 
                placeholder="0 (kg)"
                step={0.01}
                required 
                defaultValue={screeningData?.vitalSignals?.weight}
                disabled={!editable}
              />

              <InputField
                type="number"
                step={0.01}
                textLabel="ALTURA ((m)"
                name="height"
                placeholder="0 (m)"
                defaultValue={screeningData?.vitalSignals?.height}
                disabled={!editable}
              />

              <InputField
                type="number"
                textLabel="IMC (kg/m²)"
                name="imc"
                placeholder="0 (kg/m²)"
                disabled
                defaultValue={screeningData?.vitalSignals?.imc}
              />

              <InputField
                type="number"
                textLabel="SpO2 ((%) opcional)"
                name="sp02"
                step={0.01}
                placeholder="0 (%)"
                defaultValue={screeningData?.vitalSignals?.sp02}
                disabled={!editable}
              />

              <InputField
                type="number"
                textLabel="PVC ((CH20) opcional)"
                name="pvc"
                placeholder="0 (CH20)"
                defaultValue={screeningData?.vitalSignals?.pvc}
                disabled={!editable}
              />

              <InputField
                type="number"
                step={0.01}
                textLabel="GLICEMIA ( (mg/dl) opcional)"
                name="bloodGlucose"
                placeholder="0 (mg/dl)"
                defaultValue={screeningData?.vitalSignals?.bloodGlucose}
                disabled={!editable}
              />
            </div> 
          </>
        }

        { ui === "priority" &&
          <>
            <div className="w-96">
              <Selection
                label="Prioridade"
                options={priorityToComponent}
                defaultValue={screeningData?.priority as string}
                name="priority"
                required
                disabled={!editable}
              />
            </div>
          </>
        }

        { ui === "state" && 
          <>
            <InputDetails
              textLabel="Estado actual"
              placeholder="Diga como o utente está actualmente..."
              name="state"
              defaultValue={screeningData?.state}
              required
              disabled={!editable}
            />
          </>
        }

        { ui === "advice" && 
          <>  
            <InputDetails
              textLabel="Recomendações"
              placeholder="O que gostaria de recomendar ?"
              name="advice"
              defaultValue={screeningData?.advice}
              required
              disabled={!editable}
            />
          </>
        }

        <div className="flex gap-x-3">
          <Button 
            type="button"
            cancel={editable}
            onClick={()=>setEditable(!editable)}
          >
            {editable?"Cancelar":"Editar"}
          </Button>

          <Button 
            type="submit" 
            disabled={!editable}
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
//   const [ state, action ] = useActionState(insertScreening, initialState);
  
//   useEffect(()=>{
//     if(state.message){
//       if(state.status)
//         toast.success(state.message);
//       else
//         toast.error(state.message);
//     }
//   }, [state]);
//   return(
//     <div>
//       <form {...{action}} className="py-3">
//         <input type="hidden" name="screeningId" value={screeningId} />
        
//         <InputDetails
//           textLabel="Escreva na caixa de Texto"
//           placeholder="Descreva o motivo da vinda do utente..."
//           name="reason"
//           required
//         />

//         <Button>Salvar</Button>
//       </form>
//     </div>
//   );
// }

// function VitalSignalsForm({ screeningId }:ScreeningProps){

//   return<></>;
// }

// // function VitalSignalsForm({
// //   jsonData,
// //   hasData,
// //   screeningId
// // }:FormProps){
// //   const parsedData = jsonData?JSON.parse(jsonData as string) as VitalSignalType:undefined;
// //   const [ messageState, setMessageState ] = useState(false);
// //   const [ state, action ] = useActionState(!!hasData?
// //     updatePatientScreening:signPatientScreening, 
// //     { message: "", status: false }
// //   );
// //   const [ isEdit, setIsEdit ] = useState(!!hasData);
// //   const router = useRouter();
// //   const { patientId }: { patientId: string } = useParams();
// //   const disableEdit = ()=> setIsEdit(true);

// //   useEffect(()=>{
// //     if(state?.message){
// //       setMessageState(true);

// //       setTimeout(()=>{
// //         if(state?.status){
// //           disableEdit();
// //           router.refresh();
// //         }
// //         setMessageState(false);
// //       },state.status?2000:3000);
// //     }
// //   }, [state, router]);

// //   return(
// //     <div>
// //       <div>
// //         <Header title="Sinais Vitais do Utente" />
// //       </div>
// //       <form {...{action}} className="py-3">
// //         <input type="hidden" name="typeData" value="vital signal" />
// //         <input type="hidden" name="patientId" value={patientId} />
// //         <input type="hidden" name="screeningId" value={screeningId} />

// //         <div className="grid grid-cols-4 gap-4">
// //           <InputField
// //             type="number"
// //             textLabel="P.A MÁXIMA (mmHG)"
// //             name="pamax" 
// //             placeholder="0 (mmHG)"
// //             disabled={isEdit}
// //             required
// //             defaultValue={parsedData?.paMax}
// //           />

// //           <InputField
// //             type="number"
// //             textLabel="P.A MÍNIMA (mmHG)"
// //             name="pamin" 
// //             placeholder="0 (mmHG)"
// //             disabled={isEdit}
// //             required
// //             defaultValue={parsedData?.paMin}
// //           />
          
// //           <InputField
// //             type="number"
// //             textLabel="PULSO (BPM)"
// //             name="jump" 
// //             placeholder="0 (BPM)"
// //             disabled={isEdit}
// //             required 
// //             defaultValue={parsedData?.jump}
// //           />

// //           <InputField
// //             type="number"
// //             step={0.01}
// //             textLabel="TEMPERATURA (°)"
// //             name="temperature"
// //             required 
// //             placeholder="0 graus(°)"
// //             disabled={isEdit}
// //             defaultValue={parsedData?.temperature}
// //           />

// //           <InputField
// //             type="number"
// //             textLabel="RESPIRAÇÂO (IRPM)"
// //             name="breathing" 
// //             required
// //             placeholder="0 (IRPM)"
// //             disabled={isEdit}
// //             defaultValue={parsedData?.breathing}
// //           />

// //           <InputField
// //             type="number"
// //             textLabel="PESO (kg)"
// //             name="weight" 
// //             placeholder="0 (kg)"
// //             step={0.01}
// //             disabled={isEdit}
// //             required 
// //             defaultValue={parsedData?.weight}
// //           />

// //           <InputField
// //             type="number"
// //             step={0.01}
// //             textLabel="ALTURA ((m)"
// //             name="height"
// //             placeholder="0 (m)"
// //             disabled={isEdit}
// //             defaultValue={parsedData?.height}
// //           />

// //           {parsedData?.imc &&
// //           <InputField
// //             type="number"
// //             textLabel="IMC (kg/m²)"
// //             name="imc"
// //             placeholder="0 (kg/m²)"
// //             disabled
// //             defaultValue={parsedData?.imc}
// //           />}

// //           <InputField
// //             type="number"
// //             textLabel="SpO2 ((%) opcional)"
// //             name="sp02"
// //             step={0.01}
// //             placeholder="0 (%)"
// //             disabled={isEdit}
// //             defaultValue={parsedData?.sp02}
// //           />

// //           <InputField
// //             type="number"
// //             textLabel="PVC ((CH20) opcional)"
// //             name="pvc"
// //             placeholder="0 (CH20)"
// //             disabled={isEdit}
// //             defaultValue={parsedData?.pvc}
// //           />

// //           <InputField
// //             type="number"
// //             step={0.01}
// //             textLabel="GLICEMIA ( (mg/dl) opcional)"
// //             name="bloodGlucose"
// //             placeholder="0 (mg/dl)"
// //             disabled={isEdit}
// //             defaultValue={parsedData?.bloodGlucose}
// //           />
// //         </div>
// //         <div className="flex gap-3">
// //           {hasData && 
// //           <Button 
// //             cancel={!isEdit} 
// //             type="button" 
// //             onClick={!isEdit?disableEdit:()=>setIsEdit(false)}>
// //             {!isEdit?"Cancelar":"Editar"}
// //           </Button>}
// //           <Button disabled={isEdit}>{hasData?"Actualizar":"Salvar"}</Button>
// //         </div>
// //         {
// //           state?.message && messageState &&
// //           <div className="flex mt-3">
// //             <Alert
// //               type={state?.status?'success':'error'}
// //               message={state?.message}
// //             />
// //           </div>
// //         }
// //       </form>
// //     </div>
// //   )
// // }

// function PriorityForm({
//   jsonData,
//   hasData,
//   screeningId
// }:FormProps){
//   const parsedData = hasData?JSON.parse(jsonData as string) as {
//     priority: string;
//   }:undefined;
//   const [ messageState, setMessageState ] = useState(false);
//   const [ state, action ] = useActionState(
//     hasData?updatePatientScreening:signPatientScreening, 
//     { message: "", status: false }
//   )
//   const [ isEdit, setIsEdit ] = useState(!!hasData);
//   const { patientId }: { patientId: string } = useParams();
//   const disableEdit = ()=> setIsEdit(true);

//   useEffect(()=>{
//     if(state?.message){
//       setMessageState(true);

//       setTimeout(()=>{
//         if(state?.status){
//           disableEdit();
//           forceRefreshPage();
//         }
//         setMessageState(false);
//       },state.status?2000:3000);
//     }
//   }, [state]);
   
//   return(
//     <div>
//       <div>
//         <Header title="Grau de Prioridade do Atendimento" />
//       </div>
//       <form {...{action}} className="py-3">
//         <input type="hidden" name="typeData" value="priority" />
//         <input type="hidden" name="patientId" value={patientId} />
//         <input type="hidden" name="screeningId" value={screeningId} />

//         <div className="w-96">
//           <Selection
//             label="Prioridade"
//             options={priorityToComponent}
//             name="priority"
//             required
//             disabled={isEdit}
//             defaultValue={parsedData?.priority}
//           />
//         </div>

//         <div className="flex gap-3">
//           {hasData && 
//           <Button 
//             cancel={!isEdit} 
//             type="button" 
//             onClick={!isEdit?disableEdit:()=>setIsEdit(false)}>
//             {!isEdit?"Cancelar":"Editar"}
//           </Button>}
//           <Button disabled={isEdit}>{hasData?"Actualizar":"Salvar"}</Button>
//         </div>
//         {
//           state?.message && messageState &&
//           <div className="flex mt-3">
//             <Alert
//               type={state?.status?'success':'error'}
//               message={state?.message}
//             />
//           </div>
//         }     
//       </form>
//     </div>
//   )
// }

// function StatusForm({
//   jsonData,
//   hasData,
//   screeningId
// }:FormProps){
//   const parsedData = jsonData?JSON.parse(jsonData as string) as { detail: string }:undefined;

//   const [ messageState, setMessageState ] = useState(false);
//   const [ state, action ] = useActionState(
//     hasData?updatePatientScreening:signPatientScreening, 
//     { message: "", status: false }
//   )
//   const [ isEdit, setIsEdit ] = useState(!!hasData);
//   const router = useRouter();
//   const { patientId }: { patientId: string } = useParams();
//   const disabledEdit = ()=> setIsEdit(true);

//   useEffect(()=>{
//     if(state?.message){
//       setMessageState(true);

//       setTimeout(()=>{
//         if(state?.status){
//           disabledEdit();
//           router.refresh();
//         }
//         setMessageState(false);
//       },state.status?2000:3000);
//     }
//   }, [state, router]);

//   return(
//     <div>
//       <div>
//         <Header title="Estado Actual do Utente" />
//       </div>
//       <form {...{action}} className="py-3">
//         <input type="hidden" name="typeData" value="status" />
//         <input type="hidden" name="patientId" value={patientId} />
//         <input type="hidden" name="screeningId" value={screeningId} />

//         <InputDetails
//           textLabel="Estado Actual"
//           placeholder="Descreva..."
//           name="detail"
//           disabled={isEdit}
//           defaultValue={parsedData?.detail}
//         />

//         <div className="flex gap-3">
//           {hasData && 
//           <Button 
//             cancel={!isEdit}
//             type="button"
//             onClick={!isEdit?disabledEdit:()=>setIsEdit(false)}>
//             {!isEdit?"Cancelar":"Editar"}
//           </Button>}
//           <Button disabled={isEdit}>{hasData?"Actualizar":"Salvar"}</Button>
//         </div>
//       </form>
//       {
//         state?.message && messageState &&
//         <div className="flex mt-3">
//           <Alert
//             type={state?.status?'success':'error'}
//             message={state?.message}
//           />
//         </div>
//       }  
//     </div>
//   )
// }

// function AdviceForm({  
//   jsonData,
//   hasData,
//   screeningId
// }:FormProps){
//   const parsedData = jsonData?JSON.parse(jsonData as string) as { detail: string }:undefined;
//   const [ state, action ] = useActionState(
//     hasData?updatePatientScreening:signPatientScreening,
//     { message: "", status: false});  
//   const [ messageState, setMessageState ] = useState(false);
//   const [ isEdit, setIsEdit ] = useState(!!hasData);
//   const router = useRouter();
//   const { patientId }: { patientId: string } = useParams();
//   const disabledEdit = ()=> setIsEdit(true);

//   useEffect(()=>{
//     if(state?.message){
//       setMessageState(true);

//       setTimeout(()=>{
//         if(state?.status){
//           disabledEdit();
//           router.refresh();
//         }
//         setMessageState(false);
//       },state.status?2000:3000);
//     }
//   }, [state, router]);

//   return(
//     <div>
//       <div>
//         <Header title="Recomendações Médicas" />
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <form {...{action}}>
//             <input type="hidden" name="typeData" value="advice"/>
//             <input type="hidden" name="patientId" value={patientId} />
//             <input type="hidden" name="screeningId" value={screeningId} />

//             <InputDetails
//               textLabel="Recomendação"
//               placeholder="Descreva..."
//               name="detail"
//               disabled={isEdit}
//               defaultValue={parsedData?.detail}
//             />
                        
//             <div className="flex gap-3">
//               {hasData && 
//               <Button 
//                 cancel={!isEdit} 
//                 type="button" 
//                 onClick={!isEdit?disabledEdit:()=>setIsEdit(false)}>
//                 {!isEdit?"Cancelar":"Editar"}
//               </Button>}
//               <Button disabled={isEdit}>{hasData?"Actualizar":"Salvar"}</Button>
//             </div>
//           </form>
//           {
//             state?.message && messageState &&
//             <div className="flex mt-3">
//               <Alert
//                 type={state?.status?'success':'error'}
//                 message={state?.message}
//               />
//             </div>
//           }
//         </div>

//         <FinishScreening />  
//       </div>
//     </div>
//   );
// }

// function FinishScreening(){
//   const [ state, action ] = useActionState(finishScreening, { message: "", status: false });
//   const pathname = usePathname();
//   const [ modalState, setModalState ] = useState(false);
//   const closeModal = ()=>setModalState(false);
//   const formRef = useRef<HTMLFormElement>(null);
//   const params = useParams();
//   const router = useRouter();
//   const [ messageState, setMessageState ] = useState(false);
//   const [ messageError, setMessageError ] = useState("");
//   const [ urgencyServices, setUrgencyServices ] = useState<SelectionOption[]>([]);

//   const confirmScreening = ()=>{
//     if(formRef.current?.checkValidity())
//       formRef.current?.requestSubmit();
//     else {
//       setMessageError("Escolha o serviço!");
//       setMessageState(true);
//     }
//     closeModal();
//   }

//   useEffect(()=>{
//     if(messageError){
//       setTimeout(()=>{
//         setMessageState(false);
//         setMessageError("");
//       }, 2000);
//     }
//   }, [messageError]);

//   useEffect(()=>{
//     if(state.message){
//       setMessageState(true);

//       setTimeout(()=>{
//         setMessageState(false);
//         state.message = "";

//         if(state.status){
//           triggerUpdate({ target: "screening" });
//           router.replace('/clinical/screening');
//         }
//       }, 2000);
//     }
//   }, [state, router]);

//   useEffect(()=>{
//     getUrgencyServices()
//     .then(setUrgencyServices)
//   }, [])

//   return(
//     <form ref={formRef} action={action} hidden={pathname.includes("urgency-bank")}>
//       <input 
//         type="hidden" 
//         name="patientId" 
//         defaultValue={params.patientId} 
//       />

//       <Selection
//         label="Serviços de Urgências"
//         options={urgencyServices}
//         name="service"
//         required
//       />

//       <Button 
//         className="mb-3" 
//         type="button" 
//         onClick={()=>setModalState(true)}>
//           Seguir
//       </Button>

//       <Modal 
//         title="Concluir Triagem" 
//         onClose={closeModal}
//         onConfirm={confirmScreening}
//         open={modalState}
//         description="Tem certeza que deseja finalizar a triagem?" 
//       />

//       {
//         messageState && state.message && 
//         <Alert
//           type={state.status?"success":"error"}
//           message={state.message}
//         />
//       }

//       {
//         messageState && messageError && 
//         <Alert
//           type="warn"
//           message={messageError}
//         />
//       }
//     </form>
//   )
// }

// export {
//   ReasonForm,
//   VitalSignalsForm,
//   PriorityForm,
//   StatusForm,
//   AdviceForm,
//   FinishScreening
// };