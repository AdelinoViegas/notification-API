"use client";

import { 
  useEffect, 
  useState, 
  useRef, 
  useCallback,
  useActionState
} from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { SimpleSelectionType } from "@/components/ui/selection";
import { 
  scheduleAppointment, 
  findDoctorCalendar,
  getExams
} from "@/app/backend/api/clinical/scheduling-api";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/alert";
import { getDoctors, getSpecialties } from "@/app/backend/api/clinical/api";
import { getDateInDashFormat } from "@/lib/date-formater";
import { Types } from "mongoose";
import type { DoctorCalendarReference, DoctorDayAndTime } from "@/app/backend/api/clinical/types";
import { triggerUpdate } from "@/lib/ws-trigger";

type DoctorRole = {
  _id: string;
  roleId: string;
};

export default function Page(){
  const [ state, action ] = useActionState(scheduleAppointment, { message: "", status: false });
  const [ closeAlert, setCloseAlert ] = useState(true);
  const [ doctors, setDoctors ] = useState<SimpleSelectionType[]>([]);
  const [ doctorDays, setDoctorDays ] = useState<SimpleSelectionType[]>([]);
  const [ specialties, setSpecialties ] = useState<SimpleSelectionType[]>([]);
  const [ consults, setConsults ] = useState<SimpleSelectionType[]>([]);
  const [ doctorTime, setDoctorTime ] = useState<DoctorDayAndTime>();
  const [ messageState, setMessageState ] = useState(false);
  const doctorsRef = useRef<Array<DoctorRole>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const params = useParams();
  const doctorDayRef = useRef<DoctorCalendarReference[]>();
 
  const filterDoctors = useCallback(async (e: unknown)=>{
    const specialtyId = (e as { target: { value?: string } }).target?.value;
    if(!specialtyId){
      setDoctors(doctorsRef.current as unknown as SimpleSelectionType[]);
      return;
    }
    const newDoctorsList = doctorsRef.current.filter(doctor => doctor?.roleId === specialtyId) as unknown as SimpleSelectionType[];
    const consults = await getExams({ options: true, specialtyId }) as SimpleSelectionType[];
    setConsults(consults);
    setDoctors(newDoctorsList);
  }, []);

  const handleSelectDoctor = useCallback(async(e: unknown)=>{
    const doctorId = (e as { target: { value: string } }).target.value;

    if(doctorId){
      const doctorCalendars = await findDoctorCalendar({doctorId});
      const formatedCalendars = []; 

      if(doctorCalendars.length){
        for(const calendar of doctorCalendars){
          formatedCalendars.push({
            _id: new Types.ObjectId().toString(),
            label: getDateInDashFormat(calendar.day),
            calendar,
          });
        }

        setDoctorDays(formatedCalendars);
        doctorDayRef.current = formatedCalendars;
      }else{
        setCloseAlert(false);
        setDoctorDays([]);
        setDoctorTime(undefined);
      }
    }else{
      setCloseAlert(false);
      setDoctorDays([]);
      setDoctorTime(undefined);
    }
  }, []);

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
        availableDoctorSpace
      });
      
      setCloseAlert(true);
    }else{
      setCloseAlert(false);
      setDoctorTime(undefined);
    }
  }, []);

  useEffect(()=>{
    if(state.status)
      setCloseAlert(false);

    setMessageState(true);
    
    setTimeout(()=>{
      setMessageState(false);

      if(state.status){
        triggerUpdate({ target: "appointment" });
        triggerUpdate({ target: "patient" });
        formRef.current?.reset();
        setDoctorDays([]);
      }
    }, state.status?3000:7000);
  }, [state]);

  useEffect(()=>{
    const loadData = async ()=>{  
      const doctors = await getDoctors() as SimpleSelectionType[];
      doctorsRef.current = await getDoctors() as unknown as DoctorRole[];
      const tmpSpecialties = await getSpecialties();
  
      setSpecialties(tmpSpecialties);
      setDoctors(doctors);
    }
    loadData();
  }, []);

  return(
    <main>
      <form {...{action}} ref={formRef}>
        <input 
          type="hidden" 
          name="patientId" 
          defaultValue={params.patientId} 
        />

        <div className="grid xl:grid-cols-5 gap-3">
          <Selection
            label="Especialidade"
            defaultOptionLabel="Todas"
            options={specialties}
            onChange={filterDoctors}
          />

          <Selection
            label="Médico"
            name="doctorId"
            className="lg:col-span-2"
            options={doctors}
            onChange={handleSelectDoctor}
            required
          />

          <Selection
            label="Tipo de Consulta"
            name="consultId"
            options={consults}
            required
          />

          <Selection
            label="Data da Consulta"
            options={doctorDays}
            onChange={handleDoctorDay}
            required
          />

          <InputField
            textLabel="Hora da Consulta"
            type="time" 
            name="time"
            min={doctorTime?.startAt}
            max={doctorTime?.endAt}
            required
          />

          <input
            type="hidden"
            name="date"
            defaultValue={doctorTime?.day.toISOString()}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-end justify-between gap-3">
          <div className="min-w-96">
            { closeAlert && !!doctorTime?.startAt && 
              <Alert
                type="warn"
                message={`Horário disponivel das ${doctorTime?.startAt} 
                até ${doctorTime?.endAt} e com ${doctorTime.availableDoctorSpace.spaces} vagas`} 
              />
            }
          </div>
        </div>

        <InputDetails
          textLabel="Observação"
          placeholder="Descreva alguma nota sobre o agendamento"
          name="detail" 
        />

        <Button>Agendar</Button>

        {
          state.message && messageState &&
          <div className="flex mt-3">
            <Alert
              type={state.status?'success':'error'}
              message={state.message}
            />
          </div>
        }
      </form>
    </main>
  );
}