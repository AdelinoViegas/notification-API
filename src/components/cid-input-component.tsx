"use client";

import { useCallback, useEffect, useState } from "react";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import debounce from "debounce";
import { queryCid } from "@/backend/api/storage";
import { type AxiosError } from "axios";
import Button from "@/components/ui/button";
import FallbackComponent from "@/components/fallback-components";

type Cid = {
  code: string;
  value: string;
}

export default function CidInputComponent({ defaultValue }: { defaultValue?: string }){
  // o defaultValue deve ser um array de codigos cid: { code: string }[]
  const [ results, setResults ] = useState<SelectionOption[]>([]);
  // const tempNamesRefs = useRef([]);
  const [ selectedRef, setSelectedRef ] = useState("")
  const [ allSavedRefs, setAllSavedRefs ] = useState<string[]>(
    defaultValue 
    ? JSON.parse(defaultValue) as string[]
    : []
  );
  const [ nameRefs, setNameRefs ] = useState<Cid[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);

  const handlerSearchByReference = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    queryCid(ev.target.value).then(data => {

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

  const resolveAllSavedRefs = useCallback(async()=> {
    const refs: Cid[] = [];

    for(const ref of allSavedRefs)
      refs.push(await queryCid(ref) as Cid);

    setNameRefs(refs);
    setIsLoading(false);
  }, []);

  useEffect(()=> {
    setIsLoading(true);
    resolveAllSavedRefs()
  }, []);

  return (
    <div>
      <input type="hidden" name="CID" value={allSavedRefs.slice(0, -1)} />

      <div className="flex gap-x-3">
        <InputField
          textLabel="Nome ou Código CID 10"
          placeholder="Descreva com precisão a referência da CID 10 ou o código"
          onChange={handlerSearchByReference}
        />

        <div className="flex gap-x-3 items-center grow">
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
      </div>

      <div>
        {isLoading && <FallbackComponent lines={3} />}
        <ul>
          {nameRefs.map(e => (
            <li key={e.code} className="flex gap-x-3 bg-gray-200 p-2 mb-2 rounded">
              <div className="flex gap-x-3">
                <span className="font-bold">{e.code}</span>
                <span title={e.value} className="line-clamp-1">{e.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}