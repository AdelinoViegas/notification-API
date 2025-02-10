"use client";

import { useParams } from "next/navigation";
import { useState, Dispatch, SetStateAction, useRef, ChangeEvent, useEffect } from "react";
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
import { BiTrash, BiCheck, BiChevronDown } from "react-icons/bi";
import clsx from 'clsx';
// import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import SubTitle from "./subtitle";
import InputDetails from "./input-details";
import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";

// export function ListBox({ 
//   cids, 
//   setCids, 
//   items 
// }:{ 
//   items: Cid[], 
//   cids: Cid[], 
//   setCids: Dispatch<SetStateAction<Cid[]>>
// }){
//   const [selected, setSelected] = useState({code:'', value:'Clique para escolher uma opção'});

//   const addCid = async ()=>{
//     try{
//       if(cids.find((item)=>item.code === selected.code)){
//         throw new Error("A Cid já foi Adicionada", { cause: "duplicateData" });
//       }else{
//         setCids(prev =>[...prev, {code: selected.code, value: selected.value}]);
//       }
//     }catch(err: unknown){
//       const error = err as Error;
      
//       if(error.cause == "duplicateData"){
//         toast.warn(error.message);
//         return;
//       }
//       toast.error(error.message); 
//     }
//   }

//   return (
//     <div>
//       <input
//         className="hidden"
//         name="cidCode"
//         defaultValue={selected.code}
//       />
//       <Listbox value={selected} onChange={setSelected}>
//         <ListboxButton
//           className={clsx(
//             'relative flex justify-between items-center gap-x-2 w-full rounded-lg bg-white py-2 px-5 text-left text-sm/6 text-black border-2',
//             'focus:outline-none data-[focus]:outline-2'
//           )}
//         >
//           <p>{!!items.length?selected.value:"Lista Vazia"}</p>
//           <BiChevronDown className="size-5 text-black" />
//         </ListboxButton>
//         <ListboxOptions
//           anchor="bottom"
//           transition
//           className={clsx(
//             'w-[var(--button-width)] rounded-xl border-2 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none overflow-auto scroll',
//             'transition duration-100 h-48 ease-in data-[leave]:data-[closed]:opacity-0'
//           )}
//         >
//           {items.map((cid) => (
//             <ListboxOption
//               key={cid.code}
//               value={cid}
//               className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
//             >
//               <BiCheck className="invisible size-4 fill-black group-data-[selected]:visible" />
//               <div className="text-sm/6 text-[#000000]">{cid.value}</div>
//             </ListboxOption>
//           ))}
//         </ListboxOptions>

//         <Button type="button" onClick={addCid}>Adicionar</Button>
//       </Listbox>
//     </div>
//   )
// }


// export default function ComboBox(){
//   const [ items, setItems ] = useState<Cid[]>([]);
//   const [ query, setQuery ] = useState("");
//   const [ filter, setFilter] = useState("");
//   const [ cids, setCids] = useState<Cid[]>([]);
//   const [ registeredCids, setRegisteredCids ] = useState<Cid[]>([]);
//   const { patientId } = useParams<{patientId: string}>();
  
//   const FilterCid = (filter: string)=>{
//     setFilter(filter);
//   }

//   useEffect(()=>{
//     const getDiagnostic = async ()=>{
//       const cids = await (await fetch("/cid10.json")).json() as Cid[];
//       const codes = (await getPatientUrgencyBank(patientId)).generalClinic.diagnosticHypothesis;
//       const data  = cids.filter((cid)=>codes.includes(cid.code));
//       setRegisteredCids(data); 
//     }

//     getDiagnostic();
//   },[cids]);

//   const filterHandler = async ()=> {
//     try{
//       if(!query)
//         throw new Error("Escreva alguma coisa!");
      
//       const cids = filter === "code"?await getByCode(query.trim()):await getByName(query.trim());
    
//       if(!cids.length)
//         throw new Error("Não foi encontrado referências para esse filtro!");
      
//       if(cids.length > 500)
//         throw new Error(`Demasiados resultados para mostrar, estreite a busca (total encontrados: ${cids.length})!`, { cause: "exceeded" });

//       setItems(cids);
//       toast.success(`Foram encontrados um total de ${cids.length} referências!`, { autoClose: 1500 });
//     }catch(e: unknown){
//       const err = e as Error;
      
//       if(err.cause == "exceeded"){
//         toast.warn(err.message);
//         return;
//       }
//       toast.error(err.message); 
//     }
//   }

//   const removeCid = (cid:Cid)=>{
//     const filteredCid = cids.filter((item)=> item !== cid);
//     setCids(filteredCid);
//   }

//   return(
//     <>
//       <div className="flex gap-x-4 justify-between mb-6">
//         <input
//           className="hidden"
//           name="cids"
//           defaultValue={!!cids.length?JSON.stringify(cids):undefined}
//         />
//         <div className="w-full flex flex-col gap-y-4">
//           <div className="flex gap-x-4 items-center">
//             <label className="text-base">Escolha filtro: </label>
//             <div className="flex gap-x-4 items-center">           
//               <InputField
//                 onChange={(e)=>FilterCid(e.target.value)}
//                 textLabel="por Código"
//                 type="radio"
//                 name="filteredCid"
//                 defaultChecked = {false}
//                 defaultValue="code"
//               />

//               <InputField
//                 onChange={(e)=>FilterCid(e.target.value)}
//                 textLabel="por Descrição"
//                 type="radio"
//                 name="filteredCid"
//                 defaultChecked = {true}
//                 defaultValue="description"
//               />
//             </div>
//           </div>
//           <div className="flex gap-x-3 justify-between items-center">
//             <InputField
//               className="w-full" 
//               textLabel="Procure pela Cid "
//               placeholder={filter==="code"?"Informe o código da CID 10":"Informe a descrição da CID 10"}
//               onChange={e => setQuery(e.target.value)} 
//             />

//             <Button type="button" onClick={filterHandler}>Filtrar</Button>
//           </div>

//           <ListBox {...{cids}} setCids={setCids} {...{items}} />
//         </div>
//         <div className="w-full mt-3 px-3 text-center">
//           <SubTitle className="text-center inline-flex mb-4">Possíveis Diagnósticos</SubTitle>
//           <div className="h-60 overflow-auto scroll">
//             {cids.length > 0?
//               <>
//               {cids.map((item, i)=>(
//                 <div key={i} className="flex justify-between items-center gap-2 px-3 py-2 bg-gray-100 my-1 rounded-md border ">
//                   {item.value}
//                     <input type="hidden" name="patientId" value={patientId}/>
//                     <button type="button" className="bg-red-500 text-white px-2 rounded-md py-1">
//                       <BiTrash onClick={()=>removeCid(item)} className="w-5"/>
//                     </button>
//                 </div>
//               ))}
//               </>:
//               <p className="text-center font-medium">Lista Vazia</p>
//             }
//           </div>
//         </div>
//       </div>

//       <div className="w-full mt-3 mb-2 px-3">
//         <SubTitle className="inline-flex mb-4">Cids Registradas</SubTitle>
//         <div className=" border-2 rounded-lg h-60 overflow-auto scroll">
//           {registeredCids.length > 0?
//             <>
//             {registeredCids.map((item, i)=>(
//               <div key={i} className="p-3 py-2 my-1 rounded-md">
//                 <span className="font-black">{item.code} - </span>{item.value}
//               </div>
//             ))}
//             </>:
//             <p className="text-center font-medium">Lista Vazia</p>
//           }
//         </div>
//       </div>
//     </>
//   )
// }

import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";

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
            <p>{selectedCid?.value}</p>
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
      <div>
        {selectedCids.map((item, index)=>(
          <div key={index} className="outline outline-gray-300 outline-1 rounded bg-gray-200 justify-between px-3 py-2 my-3 flex gap-x-3 items-center">
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
    <div>
      <div className="flex gap-x-3">
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

      <div className="w-full"> 
        <div className="flex gap-x-3 items-center">
          <InputField
            textLabel="Buscar"
            type="search"
            className="w-full"
            onChange={e => setSearchValue(e.target.value)}
            placeholder={searchByType === "description"?"Buscar pela descrição...":"Buscar pelo codigo..."}
          />
          <Button type="button" onClick={handleCidSearch}>
            <FiSearch />
          </Button>
        </div>

        <div className="w-full flex gap-x-3 items-end">
          <ListBox />
          <Button 
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