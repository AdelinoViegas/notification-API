"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useState } from "react";
import Accordium from "@/components/ui/accordium";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Table from "@/components/table";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Selection from "@/components/ui/selection";
import { toast } from "react-toastify";
import { signUrgencyBank, updateClinicalDiary } from "@/backend/api/clinical/urgency-bank-api";
import { parseDateTimeLocal } from "@/lib/date-formater";
import { diariesProps, diaryTypeProps } from "@/backend/api/clinical/types";

export type ClinicalDiaryProps = {
  accordiumTitle: string;
  modalTitle: string;
  diaryType: "diary" | "therapeutic" | "treatment" | "vital" | "annotation" | "balance";
  patientId: string;
  columns: string[];
  dataDiary: diaryTypeProps;
}

export default function ClinicalDiary({
  accordiumTitle,
  modalTitle,
  diaryType,
  patientId,
  columns,
  dataDiary,
}: ClinicalDiaryProps){
  const [selectedId , setSelectedId] = useState("");
  const [ modalState, setModalState ] = useState(false);
  const actionWrapper = useCallback( async (prevState: unknown, formData: FormData) => {
    if(selectedId) 
      return updateClinicalDiary(prevState, formData);
    
    return signUrgencyBank(prevState, formData);
  },[selectedId]);
  const [ state, action ] = useActionState(actionWrapper, {message: "", status: false});
  const router = useRouter();
  const selectedData:diariesProps[] = [];
  const tableData: Array<{ id: string; row: string[] }> = [];
  const diaryTwoFields = dataDiary.medicineDiary ?? dataDiary.nursingNotes;
  const diaryThreeFields = dataDiary.therapeuticDiary ?? dataDiary.treatmentDiary;

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
    
    if(diaryTwoFields){
      diaryTwoFields.forEach((value, index) => {
          tableData.push({
            id: String(index),
            row: [
              value.date,
              value.description,
            ]
      })});

      selectedData.push(diaryTwoFields[Number(selectedId)]);  
    }
    else if(diaryThreeFields){
        diaryThreeFields.forEach((value, index) => {
          tableData.push({
            id: String(index),
            row: [
              value.date,
              value.signature,
              value.description,
            ]
      })});

      selectedData.push(diaryThreeFields[Number(selectedId)]);
    }
    else if(dataDiary.vitalSignals){
      dataDiary?.vitalSignals.forEach((value, index) => {
        tableData.push({
          id: String(index),
          row: [
            value.date,
            value.description,
            String(value.vitalSignals.paMax),
            String(value.vitalSignals.paMin),
            String(value.vitalSignals.jump),
            String(value.vitalSignals.pvc),
            String(value.vitalSignals.imc),
            String(value.vitalSignals.spO2),
            String(value.vitalSignals.temperature),
            String(value.vitalSignals.breathing),
            String(value.vitalSignals.weight),
            String(value.vitalSignals.height),
            String(value.vitalSignals.bloodGlucose),
          ]
      })});
      
      selectedData.push(dataDiary.vitalSignals[Number(selectedId)]);  
    }
    else if(dataDiary.hydromineralBalance){
      dataDiary?.hydromineralBalance.forEach((value, index) => {
        tableData.push({
          id: String(index),
          row: [
              value.date,
              value.siteOfDrugAdministration,
              value.amount,
              value.hidromineralBalance,
              value.description,
            ]
      })});

      selectedData.push(dataDiary.hydromineralBalance[Number(selectedId)]);  
    }

  return(
    <Accordium className="bg-primary/15 hover:bg-primary/20" title={accordiumTitle}>
      <div>
        <Button onClick={()=>{
          setSelectedId("");
          setModalState(true);
        }}>
          Novo
        </Button>
      </div>

      <Table
        columns={columns}
        rows={tableData}
        rowLength={columns.length}
        openModal={setModalState}
        setParams={setSelectedId}
        dataEdit
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
            defaultValue={selectedId?parseDateTimeLocal(selectedData[0]?.date):""}
          />
          
          <input
            className="hidden"
            type="text"
            name="diaryId"
            defaultValue={selectedData[0]?._id}
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
            defaultValue={diaryType}
          />

          {(diaryType === "therapeutic" || diaryType === "treatment") &&
            <InputField 
              textLabel="Assinatura"
              placeholder="Digite a assinatura"
              name="signature"
              required
              defaultValue={selectedId?selectedData[0]?.signature:""}
            />
          }

          {diaryType === "balance" && <div>
            <InputField 
              textLabel="Via de administração"
              placeholder="Local de admininstração do medicamento"
              name="local"
              required
              defaultValue={selectedId?selectedData[0]?.siteOfDrugAdministration:""}
            />

            <div className="grid grid-cols-2 gap-x-3"> 
              <InputField 
                textLabel="Quantidade"
                placeholder="Quantidade"
                type="number"
                name="amount"
                required
                defaultValue={selectedId?selectedData[0]?.amount:""}
              />

              <Selection
                label="Balanço Hidromineral"
                name="balance"
                required
                options={[
                  { _id: "ingested", label: "Ingeridos" },
                  { _id: "eliminated", label: "Eliminados" },
                ]}
                defaultValue={selectedId?selectedData[0]?.hidromineralBalance:""}
              />
            </div>
          </div>}

          <InputDetails
            textLabel="Descrição"
            placeholder="Descreva a sua observação..."
            name="description"
            required
            defaultValue={selectedId?selectedData[0]?.description:""}
          />

          { diaryType === "vital" && <div className="grid grid-cols-2 gap-x-3">
            <InputField
              type="number"
              textLabel="P.A MÍNIMA (mmHG)"
              name="pamin" 
              placeholder="0 (mmHG)"
              required
              defaultValue={selectedId?selectedData[0].vitalSignals?.paMin:""}
            />

            <InputField
              type="number"
              textLabel="P.A MÁXIMA (mmHG)"
              name="pamax" 
              placeholder="0 (mmHG)"
              required
              defaultValue={selectedId?selectedData[0].vitalSignals?.paMax:""}
            />
            
            <InputField
              type="number"
              textLabel="PULSO (BPM)"
              name="jump" 
              placeholder="0 (BPM)"
              required
              defaultValue={selectedId?selectedData[0].vitalSignals?.jump:""}
            />
  
            <InputField
              type="number"
              step={0.01}
              textLabel="TEMPERATURA (°)"
              name="temperature"
              required 
              placeholder="0 graus(°)"
              defaultValue={selectedId?selectedData[0].vitalSignals?.temperature:""}
            />
  
            <InputField
              type="number"
              textLabel="RESPIRAÇÂO (IRPM)"
              name="breathing" 
              required
              placeholder="0 (IRPM)"
              defaultValue={selectedId?selectedData[0].vitalSignals?.breathing:""}

            />
  
            <InputField
              type="number"
              textLabel="PESO ((kg) opcional)"
              name="weight" 
              placeholder="0 (kg)"
              step={0.01}
              defaultValue={selectedId?selectedData[0].vitalSignals?.weight:""} 
            />
  
            <InputField
              type="number"
              step={0.01}
              textLabel="ALTURA ((m) opcional)"
              name="height"
              placeholder="0 (m)"
              defaultValue={selectedId?selectedData[0].vitalSignals?.height:""}
            />
  
            <InputField
              type="number"
              textLabel="SpO2 ((%) opcional)"
              name="spO2"
              step={0.01}
              placeholder="0 (%)"
              defaultValue={selectedId?selectedData[0].vitalSignals?.spO2:""}
            />
  
            <InputField
              type="number"
              textLabel="PVC ((CH20) opcional)"
              name="pvc"
              placeholder="0 (CH20)"
              defaultValue={selectedId?selectedData[0].vitalSignals?.pvc:""}
            />
  
            <InputField
              type="number"
              step={0.01}
              textLabel="GLICEMIA ( (mg/dl) opcional)"
              name="bloodGlucose"
              placeholder="0 (mg/dl)"
              defaultValue={selectedId?selectedData[0].vitalSignals?.bloodGlucose:""}
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