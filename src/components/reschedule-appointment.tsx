"use client";

import { 
  useState,
  useEffect, 
  useRef, 
  useCallback,
  useActionState 
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { rescheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
import Selection,{ SelectionOption } from "@/components/ui/selection";
import { findDoctorCalendar } from "@/app/backend/api/clinical/scheduling-api";
import { getDateInDashFormat } from "@/lib/date-formater";
import { getDoctors } from "@/app/backend/api/clinical/api";
import type { DoctorCalendarReference, DoctorDayAndTime } from "@/app/backend/api/clinical/types";

export default function RescheduleAppointment({
  doctorId, 
  date,
  hour,
  scheduleId,
  isArchived,
}:{
  scheduleId: string;
  doctorId: string;
  date: Date;
  hour: string;
  isArchived? :boolean;
}){
  const [ state, action ] = useActionState(rescheduleAppointment, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const [ doctors, setDoctors ] = useState<SelectionOption[]>([]);
  const [ doctorDays, setDoctorDays ] = useState<SelectionOption[]>([]);
  const [ doctorTime, setDoctorTime ] = useState<DoctorDayAndTime>();
  const doctorDayRef = useRef<DoctorCalendarReference[]>(null);

  const handleSelectDoctor = useCallback(async(e?: unknown)=>{
    const doctorId = (e as { target: { value: string } }).target.value;

    if(doctorId){
      const doctorCalendars = await findDoctorCalendar({ doctorId, exceptDay: date });
      const formatedCalendars = []; 

      if(doctorCalendars.length){
        for(const calendar of doctorCalendars){
          formatedCalendars.push({
            _id: calendar.day.toISOString().split('T')[0],
            label: getDateInDashFormat(calendar.day),
            calendar,
          });
        }

        setDoctorDays(formatedCalendars);
        doctorDayRef.current = formatedCalendars;
      }else{
        setDoctorDays([]);
        setDoctorTime(undefined);
      }
    }else{
      setDoctorDays([]);
      setDoctorTime(undefined);
    }
  }, [date]);

  // const loadData = useCallback(
  // }, [doctorId, handleSelectDoctor]);

  const handleDoctorDay = useCallback(async(e: unknown)=>{
    const dateId = (e as { target: { value: string } }).target.value;
    const doctorCalendar = doctorDayRef.current?.find(props => props._id === dateId);
    
    if(doctorCalendar){
      const { calendar: { 
        initialTime, 
        finalTime,
        day,
        availableDoctorSpace
      }} = doctorCalendar;
      
      setDoctorTime({ 
        startAt: initialTime, 
        endAt: finalTime,
        day,
        availableDoctorSpace,
      });
    }
  }, []);

  useEffect(()=>{
    const loadData = async ()=>{
      const doctors = await getDoctors() as SelectionOption[];
      handleSelectDoctor({ target: { value: doctorId } });
      setDoctors(doctors);
    }
    loadData();
  }, [handleSelectDoctor, doctorId]);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          closeModal();
          if(isArchived)
            router.replace('/clinical/appointment/archiveds')
          else
            router.refresh();  
        }
      }, state.status?2000:7000);
    }
  }, [state, router, isArchived]);

  return(
    <div>
      <Button
        cancel={isArchived?true:false} 
        onClick={openModal}>
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

          <Selection
            label="Médico"
            name="doctorId"
            className="lg:col-span-2"
            options={doctors}
            onChange={handleSelectDoctor}
            defaultValue={doctorId}
          />

          <Selection
            label="Data da Consulta"
            options={doctorDays}
            onChange={handleDoctorDay}
            required
            name="date"
            defaultValue={date.toISOString().split('T')[0]} 
          />

          <div className="w-full">
            { !!doctorTime?.startAt && 
              <Alert
                type="warn"
                message={`Horário disponivel das ${doctorTime?.startAt} até ${doctorTime?.endAt} e com ${doctorTime.availableDoctorSpace.spaces} vagas`} 
              />
            }

            <InputField
              textLabel="Hora da Consulta"
              type="time" 
              name="time"
              min={doctorTime?.startAt}
              max={doctorTime?.endAt}
              defaultValue={hour}
              required
            />
          </div>

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