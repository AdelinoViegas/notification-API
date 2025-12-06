"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Selection from "@/components/ui/selection";
import { getPatientState, definePatientState } from "@/backend/api/clinical/urgency-bank-api";
import { patientStates } from "@/backend/api/clinical/translator";
import SubTitle from "@/components/ui/subtitle";
import FallbackComponent from "@/components/fallback-components";
import clsx from "clsx";

type PatientState = Awaited<ReturnType<typeof getPatientState>>;

export default function DefineState({ id }: { id?: string }){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(definePatientState, { message: "", status: false });
  const [ patientState, setPatientState] = useState<PatientState>(null);
  const closeModal = () => {
    setModalState(false);
    setEdit(false);
  };
  const [ edit, setEdit ] = useState(false);
  const [ isNewState, setIsNewState ] = useState(false);
  const router = useRouter();
  const params = useParams<{ id: string; patientId: string }>();
  const patientId = id ?? params.id ?? params.patientId;
  const updatePatientState = () => getPatientState(patientId).then(state => {
    if(!state){
      setIsNewState(true);
      return;
    }

    setPatientState(state);
  });
  
  useEffect(()=>{
    updatePatientState();

    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> {
            router.refresh();
            setEdit(false);
            setPatientState(null);
            updatePatientState();
          }   
        });
      else 
        toast.error(state.message);
  }, [state, router]);
  
  return(
    <div>
      <div className="relative">
        <Button onClick={()=> setModalState(true)}>Definir Estado</Button>
        <div className={clsx(
          "absolute -top-2 -right-2 z-0 rounded-full size-4",
          patientState?.color.tw.bg,
          { "animate-ping": [ "critical","serious" ].includes(patientState?._id ?? "none") }
        )} />
      </div>
     

      <Modal 
        title="Estado do Utente"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <div className="my-4">
            <input type="hidden" name="patientId" defaultValue={patientId} />
             
           { patientState || isNewState
            ? <Selection
                label={patientState ? "Estado Atual" : "Selecione o Estado"}
                options={patientStates}
                name="stateId"
                defaultValue={patientState?._id}
                disabled={!edit}
                required
              />
            : <FallbackComponent />
            }

            <div className="my-8">
              <SubTitle className="inline-flex">Descrição</SubTitle>
              <p className="mt-1 ps-4">
                {patientState?.description ?? "Não definido"}
              </p>
            </div>
          </div>

          <div className="flex gap-x-3 justify-end">
            <Button cancel type="button" onClick={closeModal}>Fechar</Button>
            { edit && <Button>Salvar</Button> }

            { !edit && 
              <Button 
                type="button" 
                onClick={() => setEdit(true)}
                >
                  Editar
              </Button>
            }
          </div>
        </form>
      </Modal>
    </div>
  )
}