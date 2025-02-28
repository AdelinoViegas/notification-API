"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Accordium from "@/components/ui/accordium";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Table from "@/components/table";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Selection from "@/components/ui/selection";
import { toast } from "react-toastify";
import { signUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";

export type ClinicalDiaryProps = {
  accordiumTitle: string;
  modalTitle: string;
  apiType: "diary" | "therapeutic" | "treatment" | "vital" | "annotation" | "balance";
  patientId: string;
}

export default function ClinicalDiary({
  accordiumTitle,
  modalTitle,
  apiType,
  patientId,
}: ClinicalDiaryProps){
  const [ state, action ] = useActionState(signUrgencyBank, {message: "", status: false});
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, {
          onClose: router.refresh,
          autoClose: 1500
        });
      else 
        toast.error(state.message);
    }   
  },[state, router])
  
  return(
    <Accordium className="bg-primary/15 hover:bg-primary/20" title={accordiumTitle}>
      <div>
        <Button onClick={()=>setModalState(true)}>Novo</Button>
      </div>

      <Table
        columns={["Registrado em", "Descrição"]} 
        rows={[]}
      />

      <Modal
        title={modalTitle}
        onClose={()=>setModalState(false)}
        open={modalState}
      >
        <form {...{action}}>
          <InputField 
            textLabel="Data e Hora"
            name="createAt"
            required
            type="datetime-local"
          />

          <input
            className="hidden"
            type="text"
            name="patientId"
            defaultValue={patientId}
          />

          <input
            className="hidden"
            type="text"
            name="typeClinicalDiary"
            defaultValue={apiType}
          />

          {(apiType === "therapeutic" || apiType === "treatment") &&
            <InputField 
              textLabel="Assinatura"
              placeholder="Digite a assinatura"
              name="signature"
              required
            />
          }

          {apiType === "balance" && <div>
            <InputField 
              textLabel="Via de administração"
              placeholder="Local de admininstração do medicamento"
              name="local"
              required
            />

            <div className="grid grid-cols-2 gap-x-3"> 
              <InputField 
                textLabel="Quantidade"
                placeholder="Quantidade"
                type="number"
                name="amount"
                required
              />

              <Selection
                label="Balanço Hidromineral"
                name="balance"
                required
                options={[
                  { _id: "ingested", label: "Ingeridos" },
                  { _id: "eliminated", label: "Eliminados" },
                ]}
              />
            </div>
          </div>}

          <InputDetails
            textLabel="Descrição"
            placeholder="Descreva a sua observação..."
            name="description"
            required
          />

          { apiType === "vital" && <div className="grid grid-cols-2 gap-x-3">
            <InputField
              type="number"
              textLabel="P.A MÁXIMA (mmHG)"
              name="pamax" 
              placeholder="0 (mmHG)"
              required
            />
  
            <InputField
              type="number"
              textLabel="P.A MÍNIMA (mmHG)"
              name="pamin" 
              placeholder="0 (mmHG)"
              required
            />
            
            <InputField
              type="number"
              textLabel="PULSO (BPM)"
              name="jump" 
              placeholder="0 (BPM)"
              required 
            />
  
            <InputField
              type="number"
              step={0.01}
              textLabel="TEMPERATURA (°)"
              name="temperature"
              required 
              placeholder="0 graus(°)"
            />
  
            <InputField
              type="number"
              textLabel="RESPIRAÇÂO (IRPM)"
              name="breathing" 
              required
              placeholder="0 (IRPM)"
            />
  
            <InputField
              type="number"
              textLabel="PESO (kg)"
              name="weight" 
              placeholder="0 (kg)"
              step={0.01}
              required 
            />
  
            <InputField
              type="number"
              step={0.01}
              textLabel="ALTURA ((m)"
              name="height"
              placeholder="0 (m)"
            />
  
            <InputField
              type="number"
              textLabel="SpO2 ((%) opcional)"
              name="sp02"
              step={0.01}
              placeholder="0 (%)"
            />
  
            <InputField
              type="number"
              textLabel="PVC ((CH20) opcional)"
              name="pvc"
              placeholder="0 (CH20)"
            />
  
            <InputField
              type="number"
              step={0.01}
              textLabel="GLICEMIA ( (mg/dl) opcional)"
              name="bloodGlucose"
              placeholder="0 (mg/dl)"
            />
          </div>}

          <Button>Salvar</Button>
        </form>
      </Modal>
    </Accordium>
  )
}