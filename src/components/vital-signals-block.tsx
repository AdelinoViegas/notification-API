"use client";

import { useState } from "react";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import Accordium from "@/components/ui/accordium";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import Table from "@/components/table";
import InputField from "@/components/ui/input-field";

type vitalSignalProps = {
    date: Date,
    fr: number,
    pulse: number,
    spo2: number,
    ta: number,
    t: number,
}[];

export default function VitalSignalInBlock({
  vitalSignal,
  scheduleId,
  action, 
}:{ 
  action : (payload: FormData)=> void,
  scheduleId: string,
  vitalSignal: vitalSignalProps,
}){
  const [ modalState, setModalState ] = useState(false);
  const data: Array<{ id: string; row: string[] }> = [];

  if(vitalSignal)
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

  return(
    <Accordium className="bg-primary/15 hover:bg-primary/20" title="Sinal vital à admissão">
      <Button type="button" onClick={()=>setModalState(true)}>Novo</Button>
 
      <Table
        columns={[
          "Data-hora",
          "FC(pulso)",
          "FR",
          "SpO2",
          "T/A",
          "Tª",
          
        ]} 
        rows={data}
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

          <div className="grid grid-cols-2 gap-x-3">
            <InputField
              type="datetime-local"
              textLabel="Data e hora"
              name="date" 
            />

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
              name="spo2" 
              placeholder="SpO2"
              required 
            />

            <InputField
              type="number"
              step={0.01}
              textLabel="T/A"
              name="ta"
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
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </Accordium>
  )
}