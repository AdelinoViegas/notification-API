"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";
import { patientStates } from "@/backend/api/clinical/translator";
import FallbackComponent from "@/components/fallback-components";
import { externalTransfer } from "@/backend/api/clinical/api";
import InputDetails from "@/components/ui/input-details";
import InputField from "./ui/input-field";

export default function ExternalTransfer({ id }: { id?: string }){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(externalTransfer, { message: "", status: false });
  const [ selectState, setSelectState ] = useState(false);
  const [ externalUnits, setExternalUnits ] = useState<SelectionOption[]>([]);

  const closeModal = () => {
    setModalState(false);
  };
  const router = useRouter();
  const params = useParams<{ id: string; patientId: string }>();
  const patientId = id ?? params.id ?? params.patientId;

  useEffect(()=>{

    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> {
            router.replace("/clinical/urgency-bank");
          }   
        });
      else 
        toast.error(state.message);

    getExternalUnits({}).then(setExternalUnits)
  }, [state, router]);
  
  return(
    <div>
      <div className="relative">
        <Button onClick={()=> setModalState(true)}>Definir Estado</Button>
      </div>

      <Modal 
        title="Transferencia Externa"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <div className="my-4">
            <input type="hidden" name="patientId" defaultValue={patientId} />
             
           { externalUnits.length
            ? <Selection
                label="Unidades Externas"
                options={patientStates}
                name="unitId"
                required
              />
            : <FallbackComponent />
            }

            <InputDetails
              textLabel="Movito"
              placeholder="Descreva o motivo da transferencia ..."
              name="reason"
              required
            />

            <InputField
              textLabel="Data do registro"
              type="datetime-local"
              required
              name="date"
            />
          </div>

          <div className="flex gap-x-3 justify-end">
            <Button cancel type="button" onClick={closeModal}>Fechar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}