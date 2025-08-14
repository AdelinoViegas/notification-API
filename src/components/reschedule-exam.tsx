"use client";

import { 
  useState,
  useEffect,
  useActionState
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/ui/alert";
import { reschedulePatientExam } from "@/backend/api/clinical/scheduling-api";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { GrSchedulePlay } from "react-icons/gr"; 

export default function RescheduleExam({
  detail, 
  date,
  laboratories,
  scheduleId,
  isArchived
}:{
  detail: string;
  date: Date;
  laboratories: {
    current: string;
    list: SelectionOption[];
  }
  scheduleId: string;
  isArchived?: boolean;
}){
  const [ state, action ] = useActionState(reschedulePatientExam, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          closeModal();
          if(isArchived)
            router.replace('/clinical/schedule-exams-services/archiveds')
          else
            router.refresh(); 
        }
      }, 2000);
    }
  }, [state, router, isArchived]);

  return(
    <div>
      <Button
        className="flex gap-x-2" 
        cancel={isArchived?true:false} 
        onClick={openModal}
      >
        <GrSchedulePlay className="size-5"/>
        {isArchived?'Desarquivar':'Reagendar'}
      </Button>

      <Modal 
        title="Reagendar"
        open={modalState}
        onClose={closeModal}>
        <form {...{action}}>
          <input 
            type="hidden" 
            name="scheduleId" 
            defaultValue={scheduleId} 
          />

          <input 
            type="hidden" 
            name="isArchived" 
            defaultValue={String(isArchived)} 
          />

          <InputField
            textLabel="Data do Exame"
            type="datetime-local" 
            name="datatime"
            min={new Date().toISOString().split('T')[0]}
            defaultValue={date.toISOString().split('.')[0]}
          />

          <Selection
            label="Área do Exame"
            options={laboratories.list}
            defaultValue={laboratories.current}
            name="laboratoryId"
          />

          <InputDetails
            textLabel="Observação"
            placeholder="Descreva..."
            name="detail"
            defaultValue={detail} 
          />

          <div className="justify-end flex gap-3">
            <Button 
              cancel 
              type="button" 
              onClick={closeModal}>
                Cancelar
            </Button>
            <Button>Salvar</Button>
          </div>
        </form>

        {
          state.message && messageState &&
          <div className="mt-3">
            <Alert
              type={state.status?'success':'error'}
              message={state.message}
            />
          </div>
        }
      </Modal>
    </div>
  )
}