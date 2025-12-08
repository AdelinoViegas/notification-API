"use client";

import { useState, useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { 
  getNursings, 
  getSections, 
  getBeds,
  signToHospitalize,
  signInternalService
} from "@/backend/api/clinical/hospitalization-api";
import { toast } from "react-toastify";
import Selection, { SelectionOption } from "@/components/ui/selection";

export default function Accommodate({ internalServiceId }: { internalServiceId: string }){
  const [ state, action ] = useActionState(signToHospitalize, { message: "", status: false });   
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
        toast.success(state.message, { 
          onClose: () => router.replace("/clinical/hospitalization")
        });
      else
        toast.error(state.message);

    getSections().then(setSections);

    getNursings({ 
      internalServiceId,
      sectionId: selectedSection
    })
      .then(setNursings);

    getBeds(selectedNursing).then(e => setBeds(e.beds));

  }, [state, selectedSection, selectedNursing]);

  return(
    <div>
      <form action={action}>
        <input type="hidden" name="patientId" value={params.id} />
        <input type="hidden" name="serviceId" value={internalServiceId} />

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
    </div>
  )
}