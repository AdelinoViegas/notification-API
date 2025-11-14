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
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { SelectionOption } from "@/components/ui/selection";
import InputDetails from "@/components/ui/input-details";
import { 
  getServices,
  scheduleSugery
} from "@/backend/api/clinical/scheduling-api";
import { getDoctors } from "@/backend/api/clinical/api";


export type DoctorRole = {
  _id: string;
  roleId: string;
};

export default function ScheduleSurgery(
  { 
    patientId,
    ispatient,
    requestId,
    originOfRequest
  }: { 
    patientId: string;
    ispatient?: boolean;
    requestId?: string;
    originOfRequest?: string;
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
      const doctors = await getDoctors();
      const user = doctors.filter( props => props._id === userId);
      
      if(doctors)
        setDoctors(user);
      
      const dataSugeries:SelectionOption[] = [];
      const data = await getServices({ kind: "surgery"});
      const sugeries = data.filter( props => props.kind === "surgery")
        sugeries.forEach( props => {
          dataSugeries.push({
            _id: props._id,
            label: props.label,
          })
        })

      setSugeriesType(dataSugeries);
    }

    loadData();
  }, []);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=>{
            if(ispatient)
              router.replace("/clinical/patient");
            
            if(requestId)
              router.replace("/clinical/schedule-surgery/requests");

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
            defaultValue={originOfRequest ?? path.split("/")[2]}
          />

          <input
            type="hidden"
            name="doctorId"
            defaultValue={doctors[0]?._id}
          />

          <input 
            type="hidden" 
            name="requestId" 
            defaultValue={requestId} 
          />           

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