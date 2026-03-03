"use client";

import { 
  useState,
  useEffect, 
  useActionState
} from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Selection, { SelectionOption } from "@/components/ui/selection";
import InputField from "@/components/ui/input-field";
import { priorityToComponent } from "@/backend/api/clinical/translator";
import { insertScreening, getScreening, finishScreening } from "@/backend/api/clinical/api";
import { getUrgencyServices } from "@/backend/api/clinical/urgency-bank-api";

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

function DoneScreening({ 
  disabled,
  patientId 
}: { 
  disabled: boolean;
  patientId: string; 
}){
  const [ state, action ] = useActionState(finishScreening, initialState);
  const router = useRouter();
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=>setModalState(false);
  const [ urgecyServices, setUrgecyServices ] = useState<SelectionOption[]>([]);

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=>{
            closeModal();
            router.replace('/clinical/screening');
          }
        });
      else
        toast.error(state.message);
    }
  }, [state, router]);

  useEffect(()=>{
    getUrgencyServices()
    .then(data => setUrgecyServices(data));
  }, []);
  
  return(
    <div>
      <Button 
        type="button"
        disabled={disabled}
        onClick={()=>setModalState(true)}
      >
        Concluir
      </Button>
      <Modal
        open={modalState}
        asWindow
        title="Concluir Triagem do Utente"
        onClose={closeModal}
      >
        <form action={action}>
          <input type="hidden" name="patientId" value={patientId} />
          <Selection
            label="Serviço de Urgência"
            name="serviceId"
            required
            options={urgecyServices} 
          />

          <div className="flex gap-x-3">
            <Button 
              cancel 
              type="button"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default function ScreeningUI({
  ui,
  patientId,
  priority,
  scrId,
}:{
  ui: UIComponent,
  patientId: string;
  priority?: string;
  scrId?: string;
}){
  const [ state, action ] = useActionState(insertScreening, initialState);
  const [ editable, setEditable ] = useState(false);
  const [ _priority, setPriority ] = useState(priority);
  const [ screeningData, setScreeningData ] = useState<Screening>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() =>{
    if(screeningData) 
      setPriority(screeningData.priority)
  }, [priority]);

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=>{
            router.refresh();
            setEditable(false);
          }
        });
      else
        toast.error(state.message);
    }

    getScreening({ 
      patientId, 
      isServed: pathname.includes("urgency-bank") 
    })
    .then(data => setScreeningData(data as Screening));

  }, [state, patientId, pathname]);

  useEffect(()=> {
    return () => setEditable(false)
  }, [ui]);

  return(
    <div>
      <form action={action} className="py-3">
        <input type="hidden" name="t" value={ui} />
        <input type="hidden" name="Id" value={patientId} />
        <input type="hidden" name="scrId" value={scrId} />

        {ui === "reason" && 
          <>
            <InputDetails
              textLabel="Descrever o motivo da vinda"
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
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              <InputField
                type="number"
                textLabel="P.A MÁXIMA (mmHG)"
                name="paMax" 
                placeholder="0 (mmHG)"
                defaultValue={screeningData?.vitalSignals?.paMax}
                disabled={!editable}
                required
              />

              <InputField
                type="number"
                textLabel="P.A MÍNIMA (mmHG)"
                name="paMin" 
                placeholder="0 (mmHG)"
                defaultValue={screeningData?.vitalSignals?.paMin}
                disabled={!editable}
                required
              />
              
              <InputField
                type="number"
                textLabel="PULSO (BPM)"
                name="jump" 
                placeholder="0 (BPM)"
                defaultValue={screeningData?.vitalSignals?.jump}
                disabled={!editable}
                required
              />

              <InputField
                type="number"
                step={0.01}
                textLabel="TEMPERATURA (°)"
                name="temperature"
                placeholder="0 graus(°)"
                defaultValue={screeningData?.vitalSignals?.temperature}
                disabled={!editable}
                required
              />

              <InputField
                type="number"
                textLabel="RESPIRAÇÂO (IRPM)"
                name="breathing" 
                placeholder="0 (IRPM)"
                defaultValue={screeningData?.vitalSignals?.breathing}
                disabled={!editable}
                required
              />

              <InputField
                type="number"
                textLabel="PESO (kg)"
                name="weight" 
                placeholder="0 (kg)"
                step={0.01}
                defaultValue={screeningData?.vitalSignals?.weight}
                disabled={!editable}
                required
              />

              <InputField
                type="number"
                step={0.01}
                textLabel="ALTURA ((m)"
                name="height"
                placeholder="0 (m)"
                defaultValue={screeningData?.vitalSignals?.height}
                disabled={!editable}
                required
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
                key={_priority}
                options={priorityToComponent}
                label="Prioridade"
                name="priority"
                required
                defaultValue={_priority}
                disabled={!editable}
              />
            </div>
          </>
        }

        { ui === "state" && 
          <>
            <InputDetails
              textLabel="Estado actual"
              placeholder="Descreva o utente actual do utente ..."
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

        <div className="flex gap-x-2">
          <Button 
            type="button" 
            onClick={()=>setEditable(!editable)} 
            cancel={editable}
          >
            {!editable ? "Editar": "Cancelar"}
          </Button>
          <Button type="submit" disabled={!editable}>Salvar</Button>

          { !pathname.includes("urgency-bank") && 
            <DoneScreening 
              disabled={ui !== "advice"}
              patientId={patientId} 
            />
          }
        </div>
      </form>
    </div>
  );
}