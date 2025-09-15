"use client";

import { useState, useActionState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { addPrescription } from "@/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";
import Selection from "@/components/ui/selection";

export default function RegisterNursing(){
  const [ state, action ] = useActionState(addPrescription, { message: "", status: false }); 
  const [ newSectionState, setNewSectionState ] = useState(false);
  const [ modal, setModal ] = useState(false);

  const reset = ()=>{
    setNewSectionState(false);
  }
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onClose: () => setModal(false)
        });
      else
        toast.error(state.message);

  }, [state]);
  return(
    <div>
      <Button onClick={()=>setModal(true)}>Registrar Enfermagem</Button>

      <Modal
        open={modal}
        asWindow
        onClose={()=>setModal(false)}
        title="Registro de Enfermagem"
      >
        <form action={action}>
          <div className="flex gap-x-3 items-center">
            <Selection
              label="Serviço de Internamento"
              name="serviceId"
              options={[]} 
              required
              className="grow"
            />

            <Button type="button">Novo</Button>
          </div>

          {!newSectionState && <div className="flex gap-x-3 items-center">
            <Selection
              label="Ala"
              name="serviceId"
              options={[]} 
              required
              className="grow"
            />

            <Button onClick={()=>setNewSectionState(true)} type="button">Nova</Button>
          </div>}

          { newSectionState && <>
            <div className="grid md:grid-cols-3 md:gap-x-3">
              <InputField
                textLabel="Ala"
                name="section" 
                placeholder="Descrição da ALA"
                className="col-span-2"
                required
              />

              <InputField
                textLabel="Nº Maximo de camas"
                type="number"
                name="maxBed" 
                placeholder="Quantidade de cama suportados por quartos"
                required
              />
            </div>

            <InputField
              textLabel="Enfermaria"
              name="nursing" 
              placeholder="Descreva a Enfermaria"
              required
            />
          </>}

          { !newSectionState && <Selection
            label="Enfermaria"
            name="serviceId"
            options={[]} 
            required
            className="grow"
          />}

          <InputField
            textLabel="Nº da Cama"
            name="bed" 
            placeholder="Nº da cama"
            required
          />

          <div className="flex gap-x-3 items-center">
            <Button cancel onClick={()=>setModal(false)} type="button">Fechar</Button>
            <Button onClick={reset} type="button">Repor Formulario</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}