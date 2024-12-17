"use client";

import { 
  useEffect, 
  useState, 
  useRef, 
  useCallback,
  useActionState
} from "react";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import { SimpleSelectionType } from "@/components/ui/selection";
import { 
  getExams, 
  schedulePatientExam,
  getCCGs
} from "@/app/backend/api/clinical/scheduling-api";
import InputDetails from "@/components/ui/input-details";
import Alert from "@/components/alert";
import { TrashIcon } from "@heroicons/react/24/outline";
import SubTitle from "@/components/ui/subtitle";
import { triggerUpdate } from "@/lib/ws-trigger";

type Exam =  {
  id: string;
  examCode: string;
  name: string;
  category: string;
  classification: string;
  group: string;
  price: string;
};

export default function RequestExams({
  patientId
}: { 
  patientId: string; 
}){
  const [ state, action ] = useActionState(schedulePatientExam, { message: "", status: false });
  const [ messageState, setMessageState ] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [ units, setUnits ] = useState<SimpleSelectionType[]>([]);
  const [ exams, setExams ] = useState<SimpleSelectionType[]>([]);
  const [ ccgs, setCCGS ] = useState<SimpleSelectionType[]>([]);
  const [ examCart, setExamCart ] = useState<string[]>([]);
  const [ item, setItem ] = useState("");
  const [ renderAux, setRenderAux ] = useState(false);
  const [ examCache, setExamCache ] = useState<SimpleSelectionType[]>([]);

  const onSelectCCG = useCallback(async (e: unknown)=>{
    const list = [];
    const { target: { value }} = e as { target: { value: string } };
    const exams = await getExams({ options: false }) as Exam[];
    const category = ccgs.find((item) => item._id === value);
    const filter = !value?exams:exams.filter(item => item.category === category?.label);
    
    for(const e of filter)
      list.push({
        _id: e.id,
        label: e.name
      });
    
    setExams(list);
  }, [ccgs]);

  const handleUnits = useCallback(async ()=>{
    const units = await getUnits(["laboratory", "imaging"], true) as SimpleSelectionType[];
    setUnits(units);
  }, []);
  
  const addCart = ()=>{
    setRenderAux(!renderAux);
    if(item){
      if(examCart.includes(item)){
        alert("Este exame já foi adicionado!");
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

  useEffect(()=>{
    setMessageState(true)
    setTimeout(()=>{
      setMessageState(false);
      if(state.status){
        triggerUpdate({ target: "schedule-exams" });
        triggerUpdate({ target: "patient" });
        formRef.current?.reset();
        setExamCart([]);
        setItem("");
      }
    }, 3000);
  }, [state]);

  useEffect(()=>{
    const loadData = async ()=>{
      const ccgs = await getCCGs('category') as SimpleSelectionType[];
      const exams = await getExams({ options: true }) as SimpleSelectionType[];
      setExamCache(exams);
      setExams(exams);
      setCCGS(ccgs);
    }
    loadData();
  }, []);

  return(
    <div>
      <SubTitle className="inline-flex mt-3">Solicitação de Exames</SubTitle>
      <form {...{action}} ref={formRef}>
        <input 
          type="hidden" 
          name="patientId" 
          defaultValue={patientId} 
        />

        <input 
          type="hidden" 
          name="exams" 
          defaultValue={!!examCart.length?JSON.stringify(examCart):undefined} 
        />

        <div className="grid gap-3">
          <Selection
            label="Categoria"
            options={ccgs}
            defaultOptionLabel="Todas"
            onChange={onSelectCCG}
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

        <div>
          <Selection
            label="Área do Exame"
            name="laboratoryId"
            options={units}
            required
            onClick={handleUnits}
          />
{/* 
          <InputField
            textLabel="Data do Exame"
            type="datetime-local" 
            name="datetime"
            min={new Date().toISOString().split('T')[0]}
            required
          /> */}
        </div>

        <SubTitle className="inline-flex my-3">Exames escolhidos</SubTitle>
        {!!examCart.length && <ul className="max-h-48 border rounded-md p-3 px-5 scroll overflow-auto grid gap-3">
          {examCart.map((examId, i)=>(
            <li key={i}>
              <div className="flex items-center justify-between rounded-md gap-3 py-2 border bg-gray-100 px-3"> 
                <p title={examCache.find(props => props._id === examId)?.label} className="line-clamp-1">{examCache.find(props => props._id === examId)?.label}</p>
                <button onClick={()=>removeCart(examId)} type="button" className="bg-red-500 text-white px-3 py-1 rounded-lg">
                  <TrashIcon className="w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>}

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
  );
}