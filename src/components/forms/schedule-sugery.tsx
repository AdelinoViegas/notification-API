"use client";

import { 
  useEffect, 
  useState, 
  useRef, 
  useCallback,
  useActionState,
  ChangeEvent
} from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { SelectionOption } from "@/components/ui/selection";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/ui/alert";
import { getDateInDashFormat } from "@/lib/date-formater";
import { Types } from "mongoose";
import { getDoctors } from "@/backend/api/clinical/api";
import type { DoctorCalendarReference, DoctorDayAndTime } from "@/backend/api/clinical/types";
import { 
  findDoctorCalendar,
  getExams,
  scheduleSugery as scheduleSugeries
} from "@/backend/api/clinical/scheduling-api";

export type DoctorRole = {
  _id: string;
  roleId: string;
};

export default function ScheduleSugery(
  { 
    patientId,
  }: { 
    patientId: string;
  }){
  const [ state, action ] = useActionState(scheduleSugeries, { message: "", status: false });
  const [ doctors, setDoctors] = useState<SelectionOption[]>([]);
  const [ messageState, setMessageState ] = useState(false);
  const [ closeAlert, setCloseAlert ] = useState(true);
  const [ doctorDays, setDoctorDays ] = useState<SelectionOption[]>([]);
  const [sugeriesType, setSugeriesType] = useState<SelectionOption[]>([]);
  const [sugeryType, setSugeryType] = useState("");
  const [ doctorTime, setDoctorTime ] = useState<DoctorDayAndTime>();
  const doctorsRef = useRef<Array<DoctorRole>>([]);
  const doctorDayRef = useRef<DoctorCalendarReference[]>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(()=>{
    const loadData = async ()=>{  
      const doctors = await getDoctors() as SelectionOption[];
      doctorsRef.current = doctors as unknown as DoctorRole[];

      setDoctors(doctors);
    }
    loadData();

    const dataSugeries:SelectionOption[] = [];

    getExams().then(
      data => {
        const sugeries = data.filter( props => props.category.toLowerCase().includes("cirurgia"))
        sugeries.forEach( props => {
          dataSugeries.push({
            _id: props.specialtyId,
            label: props.label,
          })
        })

        setSugeriesType(dataSugeries);
    })
  }, []);
  

  const filterDoctors = useCallback(async (e: ChangeEvent<HTMLSelectElement>)=>{
    const specialtyId = e.target.value;
    const data = await getExams(specialtyId);
    const sugeryType = data.find( props => props.name === e.target.options[e.target.selectedIndex].text)?._id as string;
    setSugeryType(sugeryType);

    if(!specialtyId){
      setDoctors(doctorsRef.current as unknown as SelectionOption[]);
      return;
    }

    const newDoctorsList = doctorsRef.current.filter(doctor => doctor?.roleId === specialtyId) as unknown as SelectionOption[];
    setDoctors(newDoctorsList);
  }, []);

  const handleSelectDoctor = useCallback(async(e: ChangeEvent<HTMLSelectElement>)=>{
    const doctorId = e.target.value;

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

  const handleDoctorDay = useCallback(async(e: ChangeEvent<HTMLSelectElement>)=>{
    const dateId = e.target.value;
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
      setMessageState(true);
    
    setTimeout(()=>{
      setMessageState(false);

      if(state.status)
        formRef.current?.reset();
    
    }, state.status?3000:7000);
  }, [state, router]);


  return(
    <main className="w-full">
      <form {...{action}} ref={formRef}>
        <div className="grid xl:grid-cols-5 gap-3">
          <input 
            type="hidden" 
            name="patientId" 
            defaultValue={patientId} 
          />

          <input
            type="hidden"
            name="sugeryType"
            defaultValue={sugeryType}
          />

          <input
            type="hidden"
            name="date"
            defaultValue={doctorTime?.day.toISOString()}
          />

          <Selection
            label="Tipo de Cirurgia"
            defaultOptionLabel="Todas"
            options={sugeriesType}
            className="lg:col-span-2"
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
            label="Data da Cirurgia"
            options={doctorDays}
            onChange={handleDoctorDay}
            required
          />

          <InputField
            textLabel="Hora da Cirurgia"
            type="time" 
            name="time"
            min={doctorTime?.startAt}
            max={doctorTime?.endAt}
            required
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
          name="description" 
        />

        <Button>Solicitar</Button>

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