"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Accordium from "@/components/ui/accordium";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Table from "@/components/table";
import InputField from "@/components/ui/input-field";
//import InputDetails from "@/components/ui/input-details";
//import Selection from "@/components/ui/selection";
import { toast } from "react-toastify";
import { signUrgencyBank } from "@/backend/api/clinical/urgency-bank-api";

export type DiaryTypeProps = {
  vitalSignals?:{
    date: string,  
    description: string,
    vitalSignals: {
      fr:number
      ta: number,
      tª: number,
      sp02: number,
      pulse: number,

    }
  }[],
}

export type ClinicalDiaryProps = {
  accordiumTitle: string;
  modalTitle: string;
  apiType: "diary" | "therapeutic" | "treatment" | "vital" | "annotation" | "balance";
  patientId: string;
  columns: string[];
  dataDiary: DiaryTypeProps;
}

export default function VitalSignalInBlock(){
  const [ state, action ] = useActionState(signUrgencyBank, {message: "", status: false});
  const [ modalState, setModalState ] = useState(false);
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, {
          onClose: router.refresh,
        });
      else 
        toast.error(state.message);
    }   
  },[state, router])
   
    //const data: Array<{ id: string; row: string[] }> = [];

    /*if(dataDiary.vitalSignals)
      dataDiary?.vitalSignals.forEach((value, index) => {
        data.push({
          id: String(index),
          row: [
            value.date,
            value.description,
            String(value.vitalSignals.paMax),
            String(value.vitalSignals.paMin),
            String(value.vitalSignals.jump),
            String(value.vitalSignals.pvc),
            String(value.vitalSignals.imc),
            String(value.vitalSignals.sp02),
            String(value.vitalSignals.temperature),
            String(value.vitalSignals.breathing),
            String(value.vitalSignals.weight),
            String(value.vitalSignals.height),
            String(value.vitalSignals.bloodGlucose),
          ]
      })});*/

  return(
    <Accordium className="bg-primary/15 hover:bg-primary/20" title="Sinal vital à admissão">
      <div>
        <Button onClick={()=>setModalState(true)}>Novo</Button>
      </div>

      <Table
        columns={[
          "FC(pulso)",
          "FR",
          "SpO2",
          "T/A",
          "Tª",
          
        ]} 
        rows={[]}
      />

      <Modal
        title={"Cadastrar novos sinais vitais"}
        asWindow
        onClose={()=>setModalState(false)}
        open={modalState}
      >
        <form {...{action}}>
          <div className="grid grid-cols-2 gap-x-3">
            <InputField
              type="number"
              textLabel="FC(pulso)"
              name="pulse" 
              placeholder="pulso"
              required
            />

            <InputField
              type="number"
              textLabel="FR"
              name="fr" 
              placeholder="fr"
              required
            />
            
            <InputField
              type="number"
              textLabel="SpO2"
              name="SpO2" 
              placeholder="SpO2"
              required 
            />

            <InputField
              type="number"
              step={0.01}
              textLabel="T/A"
              name="t/a"
              required 
              placeholder="t/a"
            />

            <InputField
              type="number"
              textLabel="tª"
              name="t" 
              required
              placeholder="tsª"
            />
          </div>

          <div className="flex gap-x-3">
            <Button cancel type="button" onClick={()=>setModalState(false)}>Fechar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </Accordium>
  )
}