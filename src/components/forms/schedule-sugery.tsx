"use client";

import { 
  useEffect, 
  useState, 
  useRef,
  useActionState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserId } from "@/lib/web-token";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { SelectionOption } from "@/components/ui/selection";
import InputDetails from "@/components/ui/input-details";
import { 
  getExams,
  scheduleSugery
} from "@/backend/api/clinical/scheduling-api";
import { getDoctors } from "@/backend/api/clinical/api";
import InputField from "../ui/input-field";


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
  const [sugeriesType, setSugeriesType] = useState<SelectionOption[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(()=>{
    const loadData = async ()=>{
      const userId = await getUserId();
      const doctors = await getDoctors() as SelectionOption[];
      const user = doctors.filter( props => props._id === userId);
      
      if(user)
        setDoctors(user);
    }

    loadData();

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
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onClose: ()=>{
            if(ispatient)
              router.replace("/clinical/patient/");

            formRef.current?.reset();
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
            name="requestingService"
            defaultValue={path.split("/")[2]}
          />

          <input
            type="hidden"
            name="doctorId"
            defaultValue={doctors[0]?._id}          />           

          <Selection
            label="Tipo de Cirurgia"
            defaultOptionLabel="Todas"
            options={sugeriesType}
            name="sugeryType"
            className="w-full"
          />

          <InputField
            textLabel="Médico"
            className="w-full"
            placeholder="processar..."
            defaultValue={doctors[0]?.label}
            disabled
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