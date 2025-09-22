"use client";

import { 
  useEffect, 
  useState, 
  useRef, 
  useCallback,
  useActionState,
  ChangeEvent
} from "react";
import { useRouter, usePathname } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { SelectionOption } from "@/components/ui/selection";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/ui/alert";
import { getDateInDashFormat } from "@/lib/date-formater";
import { Types } from "mongoose";
import { getDoctors, getUser } from "@/backend/api/clinical/api";
import type { DoctorCalendarReference, DoctorDayAndTime } from "@/backend/api/clinical/types";
import { 
  findDoctorCalendar,
  getExams,
  scheduleSugery
} from "@/backend/api/clinical/scheduling-api";
import { toast } from "react-toastify";
import { getMyProfile, getUsers } from "@/backend/api/admin";

export type DoctorRole = {
  _id: string;
  roleId: string;
};

export default function ScheduleSugery(
  { 
    patientId,
    ispatient,
  }: { 
    patientId: string;
    ispatient?: boolean;
  }){
  const [ state, action ] = useActionState(scheduleSugery, { message: "", status: false });
  const [ doctors, setDoctors] = useState<SelectionOption[]>([]);
  const [ closeAlert, setCloseAlert ] = useState(true);
  const [ doctorDays, setDoctorDays ] = useState<SelectionOption[]>([]);
  const [sugeriesType, setSugeriesType] = useState<SelectionOption[]>([]);
  const [sugeryType, setSugeryType] = useState("");
  const [ doctorTime, setDoctorTime ] = useState<DoctorDayAndTime>();
  const doctorsRef = useRef<Array<DoctorRole>>([]);
  const doctorDayRef = useRef<DoctorCalendarReference[]>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(()=>{
    const loadData = async ()=>{  
      const doctors = await getDoctors() as SelectionOption[];
      doctorsRef.current = doctors as unknown as DoctorRole[];
      
      if(doctors)
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
  
  /* Função de teste */
  (async () => {
    const user = await getMyProfile();
    console.log(user);
  })(); 

  const filterDoctors = useCallback(async (e: ChangeEvent<HTMLSelectElement>)=>{
    const specialtyId = e.target.value;
    const data = await getExams(specialtyId);
    const sugeryType = data.find( props => props.name.trim() === e.target.options[e.target.selectedIndex].text.trim())?._id as string;
    setSugeryType(sugeryType);

    if(!specialtyId){
      setDoctors(doctorsRef.current as unknown as SelectionOption[]);
      return;
    }

    const newDoctorsList = doctorsRef.current.filter(doctor => doctor?.roleId === specialtyId) as unknown as SelectionOption[];
    setDoctors(newDoctorsList);
  }, []);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onClose: ()=>{
            if(ispatient)
              router.replace("/clinical/patient/");
            
            formRef.current?.reset();
            setCloseAlert(false);
          }
        });
      else 
        toast.error(state.message);
  }, [state, router]);


  return(
    <main className="w-full">
      <form {...{action}} ref={formRef}>
        <div className="2xl:flex 2xl:gap-x-2">
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
            name="requestingService"
            defaultValue={path.split("/")[2]}
          />          

          <Selection
            label="Tipo de Cirurgia"
            defaultOptionLabel="Todas"
            options={sugeriesType}
            className="w-full"
            onChange={filterDoctors}
          />

          <Selection
            label="Médico"
            name="doctorId"
            options={[]}
            className="w-full"
            defaultValue={"dd"}
            required
          />
        </div>

        <InputDetails
          textLabel="Observação"
          placeholder="Descreva alguma nota sobre o agendamento"
          name="description" 
        />

        <Button>Solicitar</Button>
      </form>
    </main>
  );
}