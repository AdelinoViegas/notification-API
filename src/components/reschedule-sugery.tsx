"use client";

import { 
  useState,
  useEffect, 
  useActionState 
} from "react";
import { GrSchedulePlay } from "react-icons/gr";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { getExams } from "@/backend/api/clinical/scheduling-api";
import { rescheduleSugery } from "@/backend/api/clinical/operating-room-api";

export default function RescheduleSugery({
  scheduleId,
}:{
  scheduleId: string;
}){
  const [ state, action ] = useActionState(rescheduleSugery, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const [sugeriesType, setSugeriesType] = useState<SelectionOption[]>([]); 
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  
  useEffect(()=>{
    const dataSugeries:SelectionOption[] = [];

    getExams().then(
      data => {
        const sugeries = data.filter( props => props.category.toLowerCase().includes("cirurgia"))
        sugeries.forEach( props => {
          dataSugeries.push({
            _id: props._id,
            label: props.label,
          })
        })

        setSugeriesType(dataSugeries);
    })
  }, []);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          closeModal();
            router.refresh();  
        }
      }, state.status?2000:7000);
    }
  }, [state, router]);

  return(
    <div>
      <Button
        className="flex gap-x-2"
        onClick={openModal}>
        <GrSchedulePlay className="size-5"/>
        Reagendar
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
          
          <Selection
            label="Tipo de Cirurgia"
            defaultOptionLabel="Todas"
            options={sugeriesType}
            name="sugeryType"
            className="w-full"
          />

          <InputField
            textLabel="Data da cirurgia"
            type="date"
            name="sugeryDate"
            required
          />

          <InputField
            textLabel="Hora da cirurgia"
            type="time"
            name="sugeryTime"
            required
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