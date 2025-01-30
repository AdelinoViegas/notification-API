"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Cid, getByName } from "@/lib/cid-query";
import InputField from "./input-field";
import Button from "./button";
import { toast } from "react-toastify";
import { 
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions, 
} from '@headlessui/react';
import { BiCheck, BiChevronDown } from "react-icons/bi"; 
import clsx from 'clsx';

export function ListBox({ items }:{ items: Cid[] }){
  const [selected, setSelected] = useState({code:'',value:'Clique para escolher uma opção'});

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
          <p>{(items.length > 0)?selected.value:'Lista Vazia'}</p>
          <BiChevronDown className="size-5 text-black" />
        </ListboxButton>
        {items.length > 0 &&
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
        }

      </Listbox>
    </div>
  )
}

export default function ComboBox(){
  const [ items, setItems ] = useState<Cid[]>([]);
  const [ query, setQuery ] = useState<string>();

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
    }catch(e: unknown){
      const err = e as Error;
      
      if(err.cause == "exceeded"){
        toast.warn(err.message);
        return;
      }

      toast.error(err.message); 
    }
  }

  return(
    <div className="mb-6">
      <div className="flex gap-3 justify-between items-center">
        <InputField
          className="w-full" 
          textLabel="Procurar pela descrição"
          placeholder="Procure pela descrição da CID 10" 
          onChange={e => setQuery(e.target.value)} 
        />

        <Button type="button" onClick={filterHandler}>Filtrar</Button>
      </div>

      <ListBox {...{items}} />
    </div>
  )

  }