"use client";

import { useParams } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import { Cid, getByName } from "@/lib/cid-query";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { toast } from "react-toastify";
import { 
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions, 
} from '@headlessui/react';
import { BiTrash, BiCheck, BiChevronDown } from "react-icons/bi";
import clsx from 'clsx';
// import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import SubTitle from "./subtitle";

export function ListBox({ setCids, items }:{ items: Cid[], setCids: Dispatch<SetStateAction<Cid[]>>}){
  const [selected, setSelected] = useState({code:'', value:'Clique para escolher uma opção'});

  const addCid = ()=>{
    setCids(prev =>[...prev, {code: selected.code, value: selected.value}]);
  }

  return (
    <div>
      <input
        className="hidden"
        name="cidCode"
        defaultValue={selected.code}
      />
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton
          className={clsx(
            'relative flex justify-between items-center gap-x-2 w-full rounded-lg bg-white py-2 px-5 text-left text-sm/6 text-black border-2',
            'focus:outline-none data-[focus]:outline-2'
          )}
        >
          <p>{selected.value}</p>
          <BiChevronDown className="size-5 text-black" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-[var(--button-width)] rounded-xl border-2 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none overflow-auto scroll',
            'transition duration-100 h-48 ease-in data-[leave]:data-[closed]:opacity-0'
          )}
        >
          {items.map((cid) => (
            <ListboxOption
              key={cid.code}
              value={cid}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
            >
              <BiCheck className="invisible size-4 fill-black group-data-[selected]:visible" />
              <div className="text-sm/6 text-[#000000]">{cid.value}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>

        <Button type="button" onClick={addCid}>Adicionar</Button>
      </Listbox>
    </div>
  )
}

export default function ComboBox(){
  const [ items, setItems ] = useState<Cid[]>([]);
  const [ query, setQuery ] = useState<string>();
  const [ cids, setCids] = useState<Cid[]>([]);
  const { patientId } = useParams<{patientId: string}>();
  
  /*useEffect(()=>{
    let cid:Cid[] = [];
    const getDiagnostic = async ()=> {
      const anamnesis = await getPatientUrgencyBank(patientId);
      if(anamnesis.generalClinic.diagnosticHypothesis.length > 0){
        for(let code of anamnesis.generalClinic.diagnosticHypothesis)
          cid.push(await getByCode(code));

        setCids(cid);
      }
    }

    getDiagnostic();
  },[patientId]);*/

  const filterHandler = async ()=> {
    try{
      if(!query)
        throw new Error("Escreva alguma coisa!");

      const cids = await getByName(query.trim());
    
      if(!cids.length)
        throw new Error("Não foi encontrado referências para esse filtro!");
      
      if(cids.length > 500)
        throw new Error(`Demasiados resultados para mostrar, estreite a busca (total encontrados: ${cids.length})!`, { cause: "exceeded" });

      setItems(cids);
      toast.success(`Foram encontrados um total de ${cids.length} referências!`, { autoClose: 1500 });
    }catch(e: unknown){
      const err = e as Error;
      
      if(err.cause == "exceeded"){
        toast.warn(err.message);
        return;
      }
      toast.error(err.message); 
    }
  }

  const removeCid = (cid:Cid)=>{
    const filteredCid = cids.filter((item)=> item !== cid);
    setCids(filteredCid);
  }

  return(
    <div className="flex gap-x-4 justify-between mb-6">
      <input
        className="hidden"
        name="cids"
        defaultValue={!!cids.length?JSON.stringify(cids):undefined}
      />
      <div className="w-full flex flex-col gap-y-5">
        <div className="flex gap-x-3 justify-between items-center">
          <InputField
            className="w-full" 
            textLabel="Procurar pela descrição"
            placeholder="Procure pela descrição da CID 10" 
            onChange={e => setQuery(e.target.value)} 
          />

          <Button type="button" onClick={filterHandler}>Filtrar</Button>
        </div>
          <ListBox {...{cids}} setCids={setCids} {...{items}} />
      </div>
      <div className="w-full mt-3 p-3">
        <SubTitle className="text-center inline-flex mb-4">Possíveis Diagnósticos</SubTitle>
        <div className="h-60 overflow-auto scroll">
          {cids.length > 0?
            <>
            {cids.map((item, i)=>(
              <div key={i} className="flex justify-between items-center gap-2 px-3 py-2 bg-gray-100 my-1 rounded-md border ">
                {item.value}
                  <input type="hidden" name="patientId" value={patientId}/>
                  <button type="button" className="bg-red-500 text-white px-2 rounded-md py-1">
                    <BiTrash onClick={()=>removeCid(item)} className="w-5"/>
                  </button>
              </div>
            ))}
            </>:
            <p className="text-center font-medium">Lista Vazia</p>
          }
        </div>
      </div>
    </div>
  )

  }