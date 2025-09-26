"use client";

import { useState, useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { 
  getInternalServices, 
  getNursings, 
  getSections, 
  getBeds,
  signInternalService,
  movePatientTo
} from "@/backend/api/clinical/hospitalization-api";

import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";

export default function InternalMoviment(){
  const [ state, action ] = useActionState(movePatientTo, { message: "", status: false }); 
  const [ serviceState, serviceAction ]= useActionState(signInternalService, { message: "", status: false});
  const [ modalService, setModalService ] = useState(false);
  
  const [ internalServices, setInternalServices ] = useState<SelectionOption[]>([]);
  const [ sections, setSections ] = useState<SelectionOption[]>([]);
  const [ nursings, setNursings ] = useState<SelectionOption[]>([]);
  const [ beds, setBeds ] = useState<SelectionOption[]>([]);
  const [ selectedSection, setSelectedSection ] = useState<string>();
  const [ selectedNursing, setSelectedNursing ] = useState<string>();

  const router = useRouter();
  const params = useParams();
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else
        toast.error(state.message);

    getSections().then(setSections);
    getNursings(selectedSection).then(setNursings);
    getBeds(selectedNursing).then(e => setBeds(e.beds));

  }, [state, selectedSection]);

  useEffect(()=>{
    if(serviceState.message)
      if(serviceState.status)
        toast.success(serviceState.message, { 
          onClose: () => setModalService(false),
        });
      else
        toast.error(serviceState.message);

    getInternalServices().then(setInternalServices);
  }, [serviceState]);

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="patientId" value={params.patientId} />
        <div className="flex gap-x-3 items-center">
          <Selection
            label="Serviço de Internamento"
            name="serviceId"
            options={internalServices} 
            required
            className="grow"
          />

          <Button disabled type="button" onClick={()=>setModalService(true)}>Novo</Button>
        </div>

        <Selection
          label="Ala"
          name="sectionId"
          options={sections} 
          onChange={e => setSelectedSection(e.target.value)}
          required
        />

        <Selection
          label="Enfermaria"
          name="nursingId"
          options={nursings} 
          onChange={e => setSelectedNursing(e.target.value)}
          required
        />

        <Selection
          label="Nº da Cama"
          name="bedId"
          options={beds} 
          required
        />

        <Button>Salvar</Button>
      </form>

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