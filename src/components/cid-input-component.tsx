"use client";

import InputField from "./ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import debounce from "debounce";
import { queryCid } from "@/backend/api/storage";
import { type AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import Button from "./ui/button";

type Cid = {
  code: string;
  value: string;
}

export default function CidInputComponent({ defaultValue }: { defaultValue?: string }){
  // o defaultValue deve ser um array de codigos cid: { code: string }[]
  const [ results, setResults ] = useState<SelectionOption[]>([]);
  const tempNamesRefs = useRef([]);
  const [ selectedRef, setSelectedRef ] = useState("")
  const [ allSavedRefs, setAllSavedRefs ] = useState<string[]>(
    defaultValue 
    ? JSON.parse(defaultValue) as string[]
    : []
  );
  const [ nameRefs, setNameRefs ] = useState<Cid[]>([]);

  const handlerSearchByReference = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    queryCid(ev.target.value).then(data => {

      console.log(data);

      if(!(data instanceof Array))
        setResults([]);

      const normalized = data instanceof Array 
      ? (data as Cid[]).map(el => ({
          _id: el.code,
          label: el.value
        }))
      : [
        { 
          _id: (data as Cid).code, 
          label: (data as Cid).value 
        }
      ]

      setResults(normalized);
    })
    .catch((ev: AxiosError) =>{
      console.log(ev.response?.statusText);
      setResults([]);
    });

  }, 500);

  const handlerAddSelectedRef = () => {
    if(!allSavedRefs.includes(selectedRef)){
      setAllSavedRefs([selectedRef, ...allSavedRefs]);
      queryCid(selectedRef).then(data => {
        setNameRefs([ ...nameRefs, data as Cid ]);
      });
    }
  }

  useEffect(()=>{
    allSavedRefs.forEach(el => {
      queryCid(el).then(data =>{
        tempNamesRefs.current = [ data, ...tempNamesRefs.current ]
      });
    });

    console.log(tempNamesRefs);
    setNameRefs(tempNamesRefs.current);

  }, []);

  return (
    <div>
      <input type="hidden" name="CID" value={allSavedRefs} />

      <InputField
        textLabel="Nome ou Código CID 10"
        placeholder="Descreva com precisão a referência da CID 10 ou o código"
        onChange={handlerSearchByReference}
      />

      <div className="flex gap-x-3 items-center">
        <Selection
          label="Referências Cid"
          options={results} 
          className="grow"
          id="ref"
          onChange={e => setSelectedRef(e.target.value)}
        />

        <Button 
          disabled={!selectedRef} 
          onClick={handlerAddSelectedRef} 
          type="button"
        >
          Adicionar
        </Button>
      </div>

      <div>
        <ul>
          {nameRefs.map(e => (
            <li key={e.code} className="flex gap-x-3 bg-gray-200 p-2 mb-2 rounded">
              <span>{e.code}</span>
              <span>{e.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute z-10 bg-black p-3 text-green-500 top-0 right-0 font-bold">
        <div>
          <pre>{JSON.stringify(allSavedRefs)}</pre>
           <pre>{JSON.stringify(nameRefs, null,2)}</pre>
            <pre>{JSON.stringify({ dv: JSON.parse(defaultValue) }, null,2)}</pre>
        </div>
      </div>
    </div>
  )
}