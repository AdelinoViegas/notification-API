"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Selection from "@/components/ui/selection";
import { defineStatePatient, getPatient } from "@/backend/api/clinical/urgency-bank-api";
import { patientStatus } from "@/backend/api/clinical/translator";
import SubTitle from "./ui/subtitle";
import clsx from "clsx";

export default function DefineState(){
  const [modalstate, setModalState] = useState(false);
  const [ state, action ] = useActionState(defineStatePatient, { message: "", status: false });
  const [ status, setStatus] = useState<string | undefined>();
  const  openModal = ()=> setModalState(true);
  const closeModal = ()=> setModalState(false);
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  useEffect(()=>{
    const fetchPatientStatus = async () => {
      const { patientStatus } = await getPatient({ patientId });
      setStatus(patientStatus);
    };
    console.log("useEffect")
    fetchPatientStatus();

    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> router.refresh()    
        });
      else 
        toast.error(state.message);

    return;
  }, [state, router]);
  
  return(
    <div>
      <Button onClick={openModal}>Definir Estado</Button>

      <Modal 
        title="Definir Estado do paciente"
        open={modalstate}
        onClose={closeModal}
        asWindow
      >
        <form action={action}>
          <div className="my-4">
            <input 
              type="hidden" 
              name="patientId" 
              defaultValue={ patientId } 
            />

            <div className="mb-8">
              <SubTitle className="inline-flex">Estado</SubTitle>
              <p className={clsx("mt-1 ps-4 font-semibold", 
                {"text-red-400": status === "critical"},
                {"text-orange-400": status === "serious"},
                {"text-yellow-500": status === "moderate"}
               )}>
                {status?patientStatus.find( props => props._id === status)?.label.toUpperCase():"Indefinido"}
              </p>
            </div>

            <div className="my-8">
              <SubTitle className="inline-flex">Descrição</SubTitle>
              <p className="mt-1 ps-4">
                {status?patientStatus.find( props => props._id === status)?.description:"Indefinido"}
              </p>
            </div>
             
            <Selection
              label="Selecione o serviço"
              options={patientStatus}
              name="patientStatus"
              required
            />
          </div>

          <div className="flex gap-x-3 justify-end">
            <Button cancel type="button" onClick={closeModal}>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}