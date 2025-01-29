"use client";
import { useState } from "react";
import { getByName } from "@/lib/cid-query";
import InputField from "./input-field";
import Button from "./button";
import { toast } from "react-toastify";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import clsx from 'clsx'

const people = [
  { id: 1, name: Array(55).fill(2).map(()=>"A") },
  { id: 2, name: 'Wade Cooper' },
  { id: 3, name: 'Tanya Fox' },
  { id: 4, name: 'Arlene Mccoy' },
  { id: 5, name: 'Devon Webb' },
  ...Array(50).fill(1).map((d, i)=> {
    return {
      id: Math.random()*10000,
      name: "random"
    }
  })
]

export function ListBox({ items }: { items: { value: string; code: string }[] }) {
  const [selected, setSelected] = useState(people[1])

  return (
    <div>
      <Listbox value={selected} onChange={setSelected} __demoMode>
        <ListboxButton
          className={clsx(
            'relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
        >
          {selected.name}

        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-[var(--button-width)] rounded-xl border border-white/5 bg-black p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
            'transition duration-100 h-32 ease-in data-[leave]:data-[closed]:opacity-0'
          )}
        >
          {people.map((person) => (
            <ListboxOption
              key={person.name}
              value={person}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
            >
              <div className="text-sm/6 text-white">{person.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}

export default function ComboBox(){
  const [ items, setItems ] = useState([]);
  const [ query, setQuery ] = useState("");
  const filterHandler = async ()=> {
    try{
      if(!query)
        throw new Error("Escreva alguma coisa!");
      const cids = await getByName(query);
      
      if(!cids.length)
        throw new Error("Não foi encontrado referências para esse filtro!");
      
      setItems(cids);
    }catch(e: unknown){
      const err = e as Error;
      toast.error(err.message); 
    }
  }
  return(
    <div>
      <div>
        <InputField onChange={e => setQuery(e.target.value)} />
        <Button type="button" onClick={filterHandler}>Filtrar</Button>
      </div>

      <ListBox items={items} />
    </div>
  )
}