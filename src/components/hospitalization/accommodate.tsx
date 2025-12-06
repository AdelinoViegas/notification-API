"use client";

import { useState, useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { 
  getNursings, 
  getSections, 
  getBeds,
  signToHospitalize,
  signInternalService
} from "@/backend/api/clinical/hospitalization-api";

import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";
import FallbackComponent from "@/components/fallback-components";

interface FallbackProps {
  serviceId?: string;
  sectionId?: string;
  nursingId?: string;
  bedId?: string;
}

export default function Accommodate(props: FallbackProps){
  const [ state, action ] = useActionState(signToHospitalize, { message: "", status: false }); 
  const [ serviceState, serviceAction ]= useActionState(signInternalService, { message: "", status: false});
  const [ modalService, setModalService ] = useState(false);
  
  const [ sections, setSections ] = useState<SelectionOption[]>([]);
  const [ nursings, setNursings ] = useState<SelectionOption[]>([]);
  const [ beds, setBeds ] = useState<SelectionOption[]>([]);
  const [ selectedSection, setSelectedSection ] = useState<string>(props?.sectionId as string);
  const [ selectedNursing, setSelectedNursing ] = useState<string>(props?.nursingId as string);

  const router = useRouter();
  const params = useParams();

  useEffect(()=>{
    if(serviceState.message)
      if(serviceState.status)
        toast.success(serviceState.message, { 
          onClose: () => setModalService(false),
        });
      else
        toast.error(serviceState.message);

  }, [serviceState]);
  
  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { 
          onClose: () => router.replace("/clinical/hospitalization")
        });
      else
        toast.error(state.message);

    getSections().then(setSections);
    getNursings({ internalServiceId: props.serviceId }).then(setNursings);
    getBeds(selectedNursing).then(e => setBeds(e.beds));

  }, [state, selectedSection, selectedNursing]);

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="patientId" value={params.id} />
        <input type="hidden" name="serviceId" value={props.serviceId} />

       { sections.length ? 
        <Selection
          label="Ala"
          name="sectionId"
          options={sections} 
          onChange={e => setSelectedSection(e.target.value)}
          required
          defaultValue={props?.sectionId}
        />: <FallbackComponent className="my-3" />}

        { nursings.length ? 
        <Selection
          label="Enfermaria"
          name="nursingId"
          options={nursings} 
          onChange={e => setSelectedNursing(e.target.value)}
          required
          defaultValue={props?.nursingId}
        />: <FallbackComponent className="my-3" />}

        {beds.length ? 
        <Selection
          label="Nº da Cama"
          name="bedId"
          options={beds} 
          required
          defaultValue={props?.bedId}
        />: <FallbackComponent className="my-3" />}

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