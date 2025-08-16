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
import { signUrgencyBank } from "@/backend/api/clinical/urgency-bank-api";
import { TableRow } from "@/lib/table-formater";

export type DiaryTypeProps = {
  medicineDiary?: {
    date: string,
    description: string,
  }[],
  nursingNotes?: {
    date: string,
    description: string,
  }[], 
  therapeuticDiary?:{
    date: string,
    signature: string,
    description:string,
  }[],
  treatmentDiary?:{
    date: string,
    signature: string,
    description:string,
  }[],
  vitalSignals?:{
    date: string,  
    description: string,
    vitalSignals: {
      paMax: number,
      paMin: number,
      jump: number,
      pvc: number,
      imc: number,
      sp02: number,
      temperature: number,
      breathing: number,
      weight: number,
      height: number,
      bloodGlucose: number,
    }
  }[],
  hydromineralBalance?: {
    date: string,
    siteOfDrugAdministration: string,
    amount: string,
    hidromineralBalance: string,
    description: string,
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

export default function ClinicalDiary({
  accordiumTitle,
  modalTitle,
  apiType,
  patientId,
  columns,
  dataDiary,
}: ClinicalDiaryProps){
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
   
    const data:TableRow[] = [];

    if(dataDiary.medicineDiary)
      dataDiary?.medicineDiary.forEach((value, index) => {
          data.push({
            id: String(index),
            row: [
              value.date,
              value.description,
            ]
      })});
    else if(dataDiary.nursingNotes)
        dataDiary?.nursingNotes.forEach((value, index) => {
          data.push({
            id: String(index),
            row: [
              value.date,
              value.description,
            ]
      })});
    else if(dataDiary.therapeuticDiary)
        dataDiary?.therapeuticDiary.forEach((value, index) => {
          data.push({
            id: String(index),
            row: [
              value.date,
              value.signature,
              value.description,
            ]
      })});
    else if(dataDiary.treatmentDiary)
      dataDiary?.treatmentDiary.forEach((value, index) => {
        data.push({
          id: String(index),
          row: [
            value.date,
            value.signature,
            value.description,
          ]
      })});
    else if(dataDiary.vitalSignals)
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
      })});
      else if(dataDiary.hydromineralBalance)
        dataDiary?.hydromineralBalance.forEach((value, index) => {
          data.push({
            id: String(index),
            row: [
              value.date,
              value.siteOfDrugAdministration,
              value.amount,
              value.hidromineralBalance,
              value.description,
            ]
      })});

  return(
    <Accordium className="bg-primary/15 hover:bg-primary/20" title={accordiumTitle}>
      <div>
        <Button onClick={()=>setModalState(true)}>Novo</Button>
      </div>

      <Table
        columns={columns} 
        rows={data}
      />

      <Modal
        title={modalTitle}
        asWindow
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

          <div className="flex gap-x-3">
            <Button cancel type="button" onClick={()=>setModalState(false)}>Fechar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </Accordium>
  )
}