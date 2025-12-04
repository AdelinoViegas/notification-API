"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { 
  getInternalServices, 
  getNursings, 
  getSections, 
  signInternalService, 
  signNursing 
} from "@/backend/api/clinical/hospitalization-api";

import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";

export default function RegisterNursing(){
  const [ state, action ] = useActionState(signNursing, { message: "", status: false }); 
  const [ serviceState, serviceAction ]= useActionState(signInternalService, { message: "", status: false});
  const [ newSectionState, setNewSectionState ] = useState(false);
  const [ modal, setModal ] = useState(false);
  const [ modalService, setModalService ] = useState(false);
  const [ newNursingState, setNewNursingState ] = useState(false);
  
  const [ internalServices, setInternalServices ] = useState<SelectionOption[]>([]);
  const [ sections, setSections ] = useState<SelectionOption[]>([]);
  const [ nursings, setNursings ] = useState<SelectionOption[]>([]);
  const [ selectedSection, setSelectedSection ] = useState<string>();

  const formRef = useRef<HTMLFormElement>(null);

  const reset = ()=>{
    setNewSectionState(false);
    setNewNursingState(false);
    formRef.current?.reset();
  }
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onClose: reset
        });
      else
        toast.error(state.message);

    getSections().then(setSections);
  }, [state]);

  useEffect(()=>{
    getNursings(selectedSection).then(setNursings);
  }, [selectedSection]);

  useEffect(()=>{
    if(serviceState.message)
      if(serviceState.status)
        toast.success(serviceState.message, { 
          onClose: () => setModalService(false)
        });
      else
        toast.error(serviceState.message);

    getInternalServices().then(setInternalServices);
  }, [serviceState]);

  return(
    <div>
      <Button onClick={()=>setModal(true)}>Registrar Enfermaria</Button>

      <Modal
        open={modal}
        asWindow
        onClose={()=>setModal(false)}
        title="Registro de Enfermaria"
      >
        <form action={action} ref={formRef}>
          <div className="flex gap-x-3 items-center">
            <Selection
              label="Serviço de Internamento"
              name="serviceId"
              options={internalServices} 
              required
              className="grow"
            />

            <Button type="button" onClick={()=>setModalService(true)}>Novo</Button>
          </div>

          {!newSectionState && <div className="flex gap-x-3 items-center">
            <Selection
              label="Ala"
              name="sectionId"
              options={sections} 
              onChange={e => setSelectedSection(e.target.value)}
              required
              className="grow"
            />

            <Button onClick={()=>setNewSectionState(true)} type="button">Nova</Button>
          </div>}

          { newSectionState && <>
            <InputField
              textLabel="Ala"
              name="sectionName" 
              placeholder="Descrição da ALA"
              required
            />

            <div className="grid md:grid-cols-3 md:gap-x-3">
              <InputField
                textLabel="Enfermaria"
                name="nursingName" 
                placeholder="Descreva a Enfermaria"
                className="col-span-2"
                required
              />

              <InputField
                textLabel="Nº Maximo de camas"
                type="number"
                name="maxBedNumber" 
                placeholder="Quantidade de cama suportados por quartos"
                required
              />
            </div>
          </>}

          {(!newSectionState && !newNursingState) && <div className="flex gap-x-3 items-center">
            <Selection
              label="Enfermaria"
              name="nursingId"
              options={nursings} 
              required
              className="grow"
            />

            <Button onClick={()=>setNewNursingState(true)} type="button">Nova</Button>
          </div>}

           { newNursingState && <>
            <div className="grid md:grid-cols-3 md:gap-x-3">
              <InputField
                textLabel="Enfermaria"
                name="nursingName" 
                placeholder="Descreva a Enfermaria"
                className="col-span-2"
                required
              />

              <InputField
                textLabel="Nº Maximo de camas"
                type="number"
                name="maxBedNumber" 
                placeholder="Quantidade de cama suportados por quartos"
                required
              />
            </div>
          </>}

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

      <Modal
        title="Novo serviço de Internamento"
        open={modalService}
        onClose={()=>setModalService(false)}
      >
        <form action={serviceAction}>
          <InputField
            textLabel="Nome"
            name="name"
            placeholder="Nome do serviço de internamento"
            required 
          />
          <Button>Salvar</Button>
        </form>
      </Modal>
    </div>
  )
}