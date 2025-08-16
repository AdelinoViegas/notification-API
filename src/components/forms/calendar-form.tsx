"use client";

import { 
  useState,
  useRef,
  useEffect,
  useActionState
} from "react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import Alert from "@/components/ui/alert";
import SubTitle from "@/components/ui/subtitle";
import { getFirstAndLastName } from "@/components/userbar";
import { BiTrash as TrashIcon } from "react-icons/bi";
import { signDoctorCalender, updateDoctorCalender } from "@/backend/api/clinical/urgency-bank-api";
import { useRouter, useParams } from "next/navigation";

type DoctorCalendar = {
  doctorId: string;
  initialTime: string;
  finalTime: string;
  room: string;
  day: string;
};

type Calendar = {
  month: number;
  description: string;
  doctors: DoctorCalendar[],
  maxSchedule: number;
};

export default function CalendarForm({
  doctors,
  calendar,
}: {
  doctors: SelectionOption[];
  calendar?: string;
}){
  const currentCalendar = calendar?JSON.parse(calendar) as Calendar:undefined; 
  const [ state, action ] = useActionState(calendar?updateDoctorCalender:signDoctorCalender,{ message:"", status:false })
  const [ cart, setCart ] = useState<DoctorCalendar[]>(calendar?currentCalendar?.doctors as DoctorCalendar[]:[]);
  const [ localMessageState, setLocalMessageState ] = useState(false);
  const [ localMessage, setLocalMessage ] = useState("");
  const [ dateRange, setDateRange ] = useState<{ min: string; max: string }>();
  const params = useParams();

  const localMonths = Array(12).fill(1).map((v, i)=>{ 
    return { 
      _id: i as unknown as string, 
      label: new Date(new Date().getFullYear(), i).toLocaleString('pt-AO', {dateStyle: 'full'}).split(' ')[3].toUpperCase()
    }
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter(); 

  const addCart = ()=>{
    let initialTime:string, finalTime:string, room:string, day:string;
    const initialTimeElement = (formRef.current?.querySelector("input#startTime") as HTMLInputElement);
    const finalTimeElement = (formRef.current?.querySelector("input#endTime") as HTMLInputElement);
    const roomElement = (formRef.current?.querySelector("input#room") as HTMLInputElement);
    const dayElement = (formRef.current?.querySelector("input#workDay") as HTMLInputElement);

    const doctorId =  (formRef.current?.querySelector("select#doctor") as HTMLSelectElement).value;
    initialTime = initialTimeElement.value;
    finalTime = finalTimeElement.value;
    room = roomElement.value;
    day = dayElement.value;
    const selectedMonth = (formRef.current?.querySelector("select#month") as HTMLSelectElement).value as unknown as number;

    if(!doctorId || !initialTime || !finalTime || !room || !day){
      setLocalMessage("Preecha todos os campos!");
      setLocalMessageState(true);
      return;
    }

    const doctorCalendar = {
      doctorId,
      initialTime,
      finalTime,
      room,
      day,
    };

    if(new Date(day).getMonth() != selectedMonth){
      setLocalMessage("O dia selecionado não vai de acordo com o mês do calendário!");
      setLocalMessageState(true);
      return;
    }

    if(doctorCalendar.initialTime.split(':')[0] > doctorCalendar.finalTime.split(':')[0]){
      setLocalMessage("Intervalo de horas inválido!");
      setLocalMessageState(true);
      return;
    }

    setCart([...cart, doctorCalendar]);
    initialTime = initialTimeElement.value = "";
    finalTime = finalTimeElement.value = "";
    room = roomElement.value = "";
    day = dayElement.value = "";
  }

  const removeCart = (day: string)=>{
    const copy = cart.filter((props)=>props.day !== day);
    setCart(copy);
  }

  useEffect(()=>{
    setTimeout(()=>{
      setLocalMessageState(false);
      setLocalMessage("");
    }, 3000);

  }, [localMessageState]);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state?.status){
          router.push("/clinical/doctor-calendar");
        }
      }, state?.status?2000:3000);
    }
  }, [state, router]);

  useEffect(()=>{
    if(cart.length){
      const min = new Date(cart[0].day);
      const max = new Date(cart[0].day);
      min.setDate(1);
      max.setMonth(max.getMonth()+1);
      max.setDate(0);
      
      setDateRange({
        min: min.toISOString().split('T')[0],
        max: max.toISOString().split('T')[0],
      });
    }else
      setDateRange(undefined);
  }, [cart]);
  
  return(
    <form ref={formRef} {...{action}}>
      <SubTitle className="inline-flex">Informações do Calendário/Escala</SubTitle>
      <input type="hidden" name="doctors" value={JSON.stringify(cart)} />
      <input type="hidden" name="calendarId" value={params.calendarId} />

      <div className="grid md:grid-cols-5 gap-3">
        <InputField
          textLabel="Titulo do Calendário/Escala" 
          name="description"
          placeholder="Descreva o titulo do documento"
          className="col-span-2"
          defaultValue={currentCalendar?.description}
          required
        />

        <Selection
          label="Mes do Ano"
          options={localMonths}
          name="month"
          id="month"
          defaultValue={currentCalendar?.month}
          disabled={calendar?true:false}
          required
        />

        { !!calendar && 
          <input 
            type="hidden" 
            name="month" 
            value={currentCalendar?.month} 
          />
        }

        <InputField
          textLabel="Nº Max de Agendamentos"
          placeholder="Informe o Nº max de agendamentos"
          name="maxSchedule"
          required
          type="number" 
          disabled={calendar?true:false}
          defaultValue={currentCalendar?.maxSchedule}
        />

        <InputField
          textLabel="Dia do Mes"
          type="date" 
          id="workDay"
          min={dateRange?.min?dateRange.min:new Date().toISOString().split('T')[0]}
          max={dateRange?.max?dateRange.max:undefined}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-6 items-center gap-3 mb-4">
        <Selection
          label="Escolha o medico"
          options={doctors}
          className="col-span-2"
          id="doctor"
        />

        <InputField
          textLabel="Horário Inicial"
          type="time"
          id="startTime"
        />

        <InputField
          textLabel="Horário Final"
          type="time" 
          id="endTime"
        />
        
        <InputField
          textLabel="Sala"
          placeholder="Escreva o nome da sala"
          id="room"
        />

        <Button className="mt-6" type="button" onClick={addCart}>Adicionar</Button>
      </div>

      { 
        !!localMessage && 
        <div className="flex my-3">
          <Alert type="warn" message={localMessage} />
        </div>
      }

      <SubTitle className="inline-flex">Tabela dos dias...</SubTitle>
      <div className="w-full mt-4">
        <div className="grid grid-cols-7 gap-2 border-b font-medium px-3 bg-primary/25 py-3 rounded-t-md">
          <p className="col-span-2">Nome</p>
          <p>Dia</p>
          <p>Dia da Semana</p>
          <p>Hora inicial</p>
          <p>Hora final</p>
          <p>Sala</p>
        </div>
        
        <ul className="h-[30vh] overflow-auto scroll">
          {cart.map((item, i)=>(
            <li key={i} className="grid grid-cols-7 gap-2 py-3 hover:bg-gray-100 px-3">
              <p className="col-span-2">{getFirstAndLastName(doctors.find(props => props._id === item.doctorId)?.label as string)}</p>
              <p>{new Date(item.day).toLocaleString('pt-AO', { dateStyle: 'medium'})}</p>
              <p>{new Date(item.day).toLocaleString('pt-AO', { weekday: "short" })}</p>
              <p>{item.initialTime}</p>
              <p>{item.finalTime}</p>
              <p className="flex gap-3 justify-between">
                {item.room}
                <button 
                  type="button" 
                  onClick={()=>removeCart(item.day)}>
                    <TrashIcon className="p-2 size-8 bg-red-500 text-white rounded" />
                </button>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <Button>Salvar</Button>

      {
        state.message && messageState &&
        <div className="mt-3">
          <Alert
            type={state.status?'success':'error'}
            message={state.message}
          />
        </div>
      }
    </form>
  );
}