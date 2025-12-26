"use client";

import InputField from "./ui/input-field";
import Selection, { SelectionOption } from "./ui/selection";
import debounce from "debounce";
import { queryCid } from "@/backend/api/storage";
import { type AxiosError } from "axios";
import { useState } from "react";

type Cid = {
  code: string;
  value: string;
}

export default function CidInputComponent({ }: { defaultValue?: string }){
  const [ results, setResults ] = useState<SelectionOption[]>([]);
  const [ selectedRefs, setSelectedRefs ] = useState([])

  const handlerSearchByReference = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.value);

    queryCid(ev.target.value).then(data => {

      if(!(data instanceof Array)){}

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
    });

  }, 500);

  return (
    <div>
      
      <InputField
        textLabel="Nome ou Código CID 10"
        placeholder="Descreva com precisão a referência da CID 10 ou o código"
        onChange={handlerSearchByReference}
      />

      <Selection
        label="Referências Cid"
        options={results} 
      />
    </div>
  )
}