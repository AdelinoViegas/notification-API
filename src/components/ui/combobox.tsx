"use client";
import { useState } from "react";
import { CID, getByCode, getByName } from "@/lib/cid-query";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { toast } from "react-toastify";
import { 
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions, 
} from '@headlessui/react';
import { BiCheck, BiChevronDown } from "react-icons/bi";
import clsx from 'clsx';
// import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
// import SubTitle from "./subtitle";
// import InputDetails from "./input-details";
// import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
// import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";

export default function ComboBox(){
  const [ initialCidList, setInitialCidList ] = useState<CID[]>([]);
  const [ searchByType, setSearchByType ] = useState<"code"|"description">("description");
  const [ searchValue, setSearchValue ] = useState("");
  const [ selectedCids, setSelectedCids ] = useState<CID[]>([]);
  const [ selectedCid, setSelectedCid ] = useState<CID>();
  
  const addToCids = ()=>{
    if(!!selectedCids.find(item => item.code === selectedCid?.code)){
      toast.warn("Esta cid já foi selecionada, escolha outra!");
      return;
    }
    
    if(selectedCid)
      setSelectedCids([...selectedCids, selectedCid]);
  }

  const removeFromCids = (cidCode: string)=>{
    setSelectedCids(selectedCids.filter(item => item.code !== cidCode));
  }

  const handleCidSearch = async () =>{
    try{
      if(!searchValue)
        throw new Error("Escreva alguma coisa!", { cause: "empty"});
      const cids = await (searchByType === "code"?getByCode(searchValue):getByName(searchValue));
      if(!cids.length)
        throw new Error("Não foi encontrado nenhum registro!", { cause: "not_found" });
      setInitialCidList(cids);
      toast.success(`Foram encontrados um total de ${cids.length} registros.`);
    }catch(e){
      const err = e as Error;
      toast.error(err.message);
    }
  }

  function ListBox(){
    return (
      <div className="w-full">
        <Listbox value={selectedCid} onChange={setSelectedCid}>
          <ListboxButton
            className={clsx(
              'relative flex justify-between items-center gap-x-2 w-full rounded-lg bg-white py-2 px-5 text-left text-sm/6 text-black border-2',
              'focus:outline-none data-[focus]:outline-2'
            )}
          >
            <p>{!!selectedCid?selectedCid.value:"Selecione..."}</p>
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
            {initialCidList.map((cid) => (
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
        </Listbox>
      </div>
    )
  }
  
  function ElementsViews(){
    return(
      <div className="max-h-48 overflow-y-auto scroll">
        {selectedCids.map((item, index)=>(
          <div key={index} className="outline outline-gray-300 outline-1 rounded bg-gray-200 justify-between px-2 py-2 my-2 flex gap-x-3 items-center">
            <h2 className="font-medium text-sm">{item.code} - {item.value}</h2>
            <button 
              className="bg-red-500 text-white px-3 py-2 rounded" 
              onClick={()=>removeFromCids(item.code)}
              type="button"
            >
              <FaRegTrashAlt />
            </button>
          </div>
        ))}
      </div>
    )
  }

  return(
    <div className="w-[500px]">
      <div className="flex gap-x-3">
        <input
          className="hidden"
          name="cids"
          defaultValue={JSON.stringify(selectedCids)}
        />

        <input
          className="hidden"
          name="location"
          defaultValue={"diagnosticHypothesis"}
        />
        
        <InputField 
          type="radio" 
          textLabel="Por Código" 
          name="filter"
          onClick={()=>setSearchByType("code")} 
        />

        <InputField 
          type="radio" 
          textLabel="Por Descrição" 
          name="filter" 
          defaultChecked
          onClick={()=>setSearchByType("description")}
        />
      </div>

      <div> 
        <div className="flex gap-x-3 items-center">
          <InputField
            textLabel="Buscar"
            type="search"
            className="w-full"
            onChange={e => setSearchValue(e.target.value)}
            placeholder={searchByType === "description"?"Buscar pela descrição...":"Buscar pelo codigo..."}
          />
          <Button 
            className="mt-6" 
            type="button" 
            onClick={handleCidSearch}
          >
            <FiSearch />
          </Button>
        </div>

        <div className="flex gap-x-3 items-center">
          <ListBox />
          <Button
            className="my-4" 
            type="button" 
            disabled={!selectedCid}
            onClick={addToCids}
          >
            <IoMdAdd />
          </Button>
        </div>
      </div>

      <ElementsViews />
    </div>
  )
}