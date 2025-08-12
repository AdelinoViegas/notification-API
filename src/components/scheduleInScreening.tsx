"use client";

import { 
  useState,
  useEffect,
  useActionState,
  useRef,
  useCallback, 
} from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import Button from "@/components/ui/button";
import { DoctorRole } from "@/components/forms/schedule-appointment";
import { BiTrash as TrashIcon } from "react-icons/bi";
import SubTitle from "@/components/ui/subtitle";
import { GrScheduleNew } from "react-icons/gr";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { findDoctorCalendar, getCCGs, getExams } from "@/app/backend/api/clinical/scheduling-api";
import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import { toast } from "react-toastify";
import clsx from "clsx";
import InputDetails from "@/components/ui/input-details";
import { finishScheduleInScreening, getDoctors, getSpecialties } from "@/app/backend/api/clinical/api";
import InputField from "@/components/ui/input-field";
import Alert from "@/components/ui/alert";
import { getDateInDashFormat } from "@/lib/date-formater";
import { Types } from "mongoose";
import { DoctorCalendarReference, DoctorDayAndTime } from "@/app/backend/api/clinical/types";


export default function ScheduleInScreening({
  patientId,
  type,
  label,
}:{
  patientId: string;
  type: "appointment" | "exam";
  label: string;
}){
  const [ state, action ] = useActionState(finishScheduleInScreening, { message: "", status: false });
  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=> setModalState(false);
  const openModal = ()=> setModalState(true);
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const formRef2 = useRef<HTMLFormElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doctorsRef = useRef<Array<DoctorRole>>([]);
  const doctorDayRef = useRef<DoctorCalendarReference[]>(null);
  const [ units, setUnits ] = useState<SelectionOption[]>([]);
  const [ exams, setExams ] = useState<SelectionOption[]>([]);
  const [ ccgs, setCCGS ] = useState<SelectionOption[]>([]);
  const [ examCart, setExamCart ] = useState<string[]>([]);
  const [ item, setItem ] = useState("");
  const [ renderAux, setRenderAux ] = useState(false);
  const [ examCache, setExamCache ] = useState<SelectionOption[]>([]);
  const [ closeAlert, setCloseAlert ] = useState(true);
  const [ doctors, setDoctors ] = useState<SelectionOption[]>([]);
  const [ doctorDays, setDoctorDays ] = useState<SelectionOption[]>([]);
  const [ specialties, setSpecialties ] = useState<SelectionOption[]>([]);
  const [ consults, setConsults ] = useState<SelectionOption[]>([]);
  const [ doctorTime, setDoctorTime ] = useState<DoctorDayAndTime>();

  const handlerCallback = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    getExams()
    .then(data => { 
      const examCopies = e.target.value?data.filter(props => props.categoryId === e.target.value):data;
      setExams(examCopies);
    })
  }

  useEffect(()=>{
    const loadDataAppointment = async ()=>{  
      const doctors = await getDoctors() as SelectionOption[];
      doctorsRef.current = doctors as unknown as DoctorRole[];
      const tmpSpecialties = await getSpecialties();
  
      setSpecialties(tmpSpecialties);
      setDoctors(doctors);
    }
    loadDataAppointment();

    const loadData = async ()=>{
      const ccgs = await getCCGs('category') as SelectionOption[];
      const exams = await getExams() as SelectionOption[];
      setExamCache(exams);
      setExams(exams);
      setCCGS(ccgs);
    }
    loadData();
  }, []);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state.status){
          setCloseAlert(false);
          formRef.current?.reset();
          formRef2.current?.reset();
          setDoctorDays([]);
          setExamCart([]);
          setItem("");
          setMessageState(false);
          closeModal();
          router.replace('/clinical/screening');
        }
        setMessageState(false);
      }, 2000);
    }
  }, [state, router]);

  const handleUnits = useCallback(async ()=>{
    const phisicalUnits = await getUnits({type: ["laboratory", "imaging"]}) as SelectionOption[];
    setUnits(phisicalUnits);
  }, []);
  
  const addCart = ()=>{
    setRenderAux(!renderAux);
    if(item){
      if(examCart.includes(item)){
        toast.warn("Este exame já foi adicionado!");
        return;
      }

      const copy = examCart;
      copy.push(item);
      setExamCart(copy);
    }
  };

  const removeCart = (examId: string)=>{
    const examCopy = examCart.filter(item => item !== examId);
    setExamCart(examCopy);
  }

  const filterDoctors = useCallback(async (e: unknown)=>{
    const specialtyId = (e as { target: { value?: string } }).target?.value;
    if(!specialtyId){
      setDoctors(doctorsRef.current as unknown as SelectionOption[]);
      return;
    }
    const newDoctorsList = doctorsRef.current.filter(doctor => doctor?.roleId === specialtyId) as unknown as SelectionOption[];
    const consults = await getExams(specialtyId) as SelectionOption[];
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
        {type === "exam"?
          <div>
            <SubTitle className="inline-flex mt-3">Solicitação de Exames</SubTitle>
            <form 
              {...{action}} 
              ref={formRef} 
            >
              <input 
                type="hidden" 
                name="patientId" 
                defaultValue={patientId} 
              />
              
              <input 
                type="hidden" 
                name="scheduleType" 
                defaultValue={type} 
              />

              <input 
                type="hidden" 
                name="exams" 
                defaultValue={!!examCart.length?JSON.stringify(examCart):undefined} 
              />
      
              <div className={clsx('grid gap-3 lg:grid-cols-2')}>
                <Selection
                  label="Categoria"
                  options={ccgs}
                  defaultOptionLabel="Todas"
                  onChange={handlerCallback}
                />
      
                <div className="flex gap-2 items-center -mt-1">
                  <Selection
                    label="Exames Cadastrados"
                    options={exams}
                    onChange={(e)=>setItem(e.target.value)}
                    className="w-full"
                  />
      
                  <Button type="button" onClick={addCart}>Adicionar</Button>
                </div>
              </div>
      
              <div className={clsx("grid gap-3 lg:grid-cols-2")}>
                <Selection
                  label="Área do Exame"
                  name="laboratoryId"
                  options={units}
                  required
                  onClick={handleUnits}
                />
      
                <div>
                  <SubTitle className="inline-flex my-3">Exames Selecionados</SubTitle>
                  {!!examCart.length && 
                    <ul className="max-h-48 border rounded-md p-3 px-5 scroll overflow-auto grid gap-3">
                      {examCart.map((examId, index)=>(
                        <li key={index}>
                          <div className="flex items-center justify-between rounded-md gap-3 py-2 border bg-gray-100 px-3"> 
                            <p 
                              title={examCache.find(props => props._id === examId)?.label} 
                              className="line-clamp-1"
                            >
                              {examCache.find(props => props._id === examId)?.label}
                            </p>
      
                            <button 
                              onClick={()=>removeCart(examId)} 
                              type="button" 
                              className="bg-red-500 text-white px-3 py-1 rounded-lg"
                            >
                              <TrashIcon className="w-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  }
                </div>
              </div>
      
              <InputDetails
                textLabel="Observação"
                placeholder="Descreva alguma nota sobre a solicitação"
                name="detail" 
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
          </div>
          :      
          <form {...{action}} ref={formRef2}>
            <input 
              type="hidden" 
              name="patientId" 
              defaultValue={patientId} 
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
          </form>}
      </Modal>
    </div>
  )
}