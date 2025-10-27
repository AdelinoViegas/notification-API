"use client";

import { 
  useState, 
} from "react";
import { GrScheduleNew } from "react-icons/gr";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import ScheduleAppointment from "@/components/forms/schedule-appointment";
import RequestExams from "@/components/forms/request-exam";

export default function ScheduleInScreening({
  patientId,
  type,
  label,
}:{
  patientId: string;
  type: "appointment" | "exam";
  label: string;
}){
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);

  return(
    <div>
      <Button 
        className="flex gap-3"
        onClick={openModal}
        >
        <GrScheduleNew className="size-5"/>
        {label}
      </Button>
      
      <Modal 
        title={type == "exam"?"Agendamento de Exame":"Agendamento de Consulta"}
        open={modalState}
        onClose={closeModal}
        widthFull
        >
        {
          type === "exam"?
            <RequestExams 
              {...{patientId}} 
              isFullWindow 
              scheduleType={type}
            />
          :
            <ScheduleAppointment 
              {...{patientId}}  
              scheduleType={type}
            />
        }
      </Modal>
    </div>
  )
}