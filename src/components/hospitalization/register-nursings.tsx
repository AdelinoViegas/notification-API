"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { 
  getAvailableBedsTotal,
  getInternalServices, 
  getNursings, 
  getSections, 
  signInternalService, 
  signNursing 
} from "@/backend/api/clinical/hospitalization-api";
import Alert from "../ui/alert";

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
  const [ selectedService, setSelectedService ] = useState<string>();
  const [ bedNumber, setBedNumber ] = useState("");
  const [ availableBeds, setAvailableBeds ] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const reset = ()=>{
    setNewSectionState(false);
    setNewNursingState(false);
    setBedNumber("");
  }

  useEffect(()=>{
    if(!modal) return;
    getInternalServices().then(setInternalServices);
    getSections().then(setSections);
    getNursings({}).then(setNursings);
  }, [modal]);
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onOpen: reset
        });
      else
        toast.error(state.message);

    getSections().then(setSections);
    setBedNumber("");
  }, [state]);

  useEffect(()=>{
    getNursings({
      sectionId: selectedSection,
      internalServiceId: selectedService
    })
    .then(setNursings);
    
  }, [selectedSection, selectedService]);

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
  

  useEffect(() => {
    getAvailableBedsTotal(bedNumber).then( res => setAvailableBeds(res));
  }, [bedNumber]);
  
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
              onChange={e => setSelectedService(e.target.value)}
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
                placeholder="Nº de camas"
                required
              />
            </div>
          </>}

          {(!newSectionState && !newNursingState) && <div className="flex gap-x-3 items-center">
            <Selection
              label="Enfermaria"
              name="nursingId"
              options={nursings}
              onChange={(e) => {setBedNumber(e.target.value)}} 
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
           
          <div className="min-w-full">
            { bedNumber && 
              <Alert
                type="warn"
                message={`Vagas disponiveis na efermaria: ${availableBeds} camas`} 
              />
            }
          </div>

          <InputField
            textLabel="Nº da cama"
            type="number"
            name="bed" 
            placeholder="Digite o da cama"
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