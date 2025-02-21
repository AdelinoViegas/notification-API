"use client";

import { 
  useState,
  useEffect, 
  useActionState
} from "react";

import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import Selection, { SelectionOption } from "@/components/ui/selection";
import InputField from "@/components/ui/input-field";
import { priorityToComponent } from "@/app/backend/api/clinical/translator";
import { insertScreening, getScreening, finishScreening } from "@/app/backend/api/clinical/api";
import { toast } from "react-toastify";
import Modal from "@/components/modal";
import { getUrgencyServices } from "@/app/backend/api/clinical/urgency-bank-api";
import { useRouter, usePathname } from "next/navigation";

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
  const [ defaultPriority, setDefaultPriority ] = useState<string>();
  const [ editable, setEditable ] = useState(false);
  const pathname = usePathname();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message);
      else
        toast.error(state.message);
    }

    getScreening({ patientId, isServed: false })
    .then(data => {
      setScreeningData(data as Screening);
      setDefaultPriority(data.priority);
    })
    .finally(()=>{
      setEditable(false);
    })
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
                options={priorityToComponent}
                label="Prioridade"
                name="priority"
                disabled={!editable}
                required
                defaultValue={defaultPriority}
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
          onClose: ()=>router.replace('/clinical/screening'),
          autoClose: 1500
        });
      else
        toast.error(state.message);
    }
  }, [state, router]);

  useEffect(()=>{
    getUrgencyServices()
    .then(data => setUrgecyServices(data))
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