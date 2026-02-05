"use client";

import { SetStateAction, useState } from "react";
import { getDataAndHoursFormat, parseDateTimeLocal } from "@/lib/date-formater";
import Accordium from "@/components/ui/accordium";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Table from "@/components/table";
import InputField from "@/components/ui/input-field";

type vitalSignalProps = {
    _id?: string,
    date: Date,
    fr: number,
    pulse: number,
    spo2: number,
    ta: string,
    t: number,
}[];

export default function VitalSignalInBlock({
  vitalSignal,
  action,
  selectedId,
  setSelectedId,
  scheduleId
}:{ 
  action : (payload: FormData)=> void,
  vitalSignal: vitalSignalProps,
  selectedId?: string,
  setSelectedId: (value: SetStateAction<string>) => void,
  scheduleId: string,
}){
  const selectedData: vitalSignalProps = [];
  const [ modalState, setModalState ] = useState(false);
  const data: Array<{ id: string; row: string[] }> = [];

  if(vitalSignal){
    vitalSignal.forEach((props, index) => {
      data.push({
        id: String(index),
        row: [
          getDataAndHoursFormat(props.date),
          String(props.pulse),
          String(props.fr),
          String(props.spo2),
          String(props.ta),
          String(props.t),
        ]
    })});

    selectedData.push(vitalSignal[Number(selectedId)]); 
  }

    return(
    <Accordium className="bg-primary/15 hover:bg-primary/20" title="Sinais Vitais à admissão">
      <Button 
        type="button" 
        onClick={()=>{
          setSelectedId("");
          setModalState(true);
        }}
      >
        Novo
      </Button>
 
      <Table
        dataEdit
        columns={[
          "Data-hora",
          "FC(pulso)",
          "FR",
          "SpO2",
          "T/A",
          "Tª",
          
        ]} 
        rows={data}
        openModal={setModalState}
        setParams={setSelectedId}
      />

      <Modal
        title={"Cadastrar novos sinais vitais"}

        open={modalState}
        onClose={()=> setModalState(false)}
      >
        <form {...{action}}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <input 
            className="hidden"
            name="vitalSignalId"
            defaultValue={selectedData[0]?._id}
          />

          <div className="grid grid-cols-2 gap-x-3">
            <InputField
              type="datetime-local"
              textLabel="Data e hora"
              name="date"
              defaultValue={selectedId?parseDateTimeLocal(getDataAndHoursFormat(selectedData[0]?.date)):""}
              required
            />

            <InputField
              type="number"
              textLabel="FC(pulso)"
              name="pulse" 
              placeholder="pulso"
              defaultValue={selectedId?selectedData[0]?.pulse:""}
              required
            />

            <InputField
              type="number"
              textLabel="FR"
              name="fr" 
              placeholder="fr"
              defaultValue={selectedId?selectedData[0]?.fr:""}
              required
            />
            
            <InputField
              type="number"
              textLabel="SpO2"
              name="spo2" 
              placeholder="SpO2"
              defaultValue={selectedId?selectedData[0]?.spo2:""}
              required 
            />

            <InputField
              type="text"
              step={0.01}
              textLabel="T/A"
              name="ta"
              pattern="^\d+(?:[.,]\d+)?\/\d+(?:[.,]\d+)?$"
              required 
              placeholder="t/a"
              defaultValue={selectedId?selectedData[0]?.ta:""}
            />

            <InputField
              type="number"
              textLabel="tª"
              name="t" 
              required
              placeholder="tsª"
              defaultValue={selectedId?selectedData[0]?.t:""}
            />
          </div>

          <div className="flex gap-x-3">
            <Button cancel type="button" onClick={()=>setModalState(false)}>Fechar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </Accordium>
  )
}