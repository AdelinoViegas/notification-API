"use client";

import { useCallback, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import debounce from "debounce";
import InputField from "@/components/ui/input-field";
import { SelectionOption } from "@/components/ui/selection";
import SelectionCID from "@/components/ui/selectionCID";
import Button from "@/components/ui/button";
import FallbackComponent from "@/components/fallback-components";
import { queryCid } from "@/backend/api/storage";

type Cid = {
  code: string;
  value: string;
}
type CidDataItems = {
  items: Cid[];
  total: number;
}

export default function CidInputComponent({ defaultValue }: { defaultValue?: string }){
  const [ results, setResults ] = useState<SelectionOption[]>([]);
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
      const normalized = data && "items" in data ?
      (data as CidDataItems).items.map(el => ({
          _id: el.code,
          label: el.value
      }))
      :[
        { 
          _id: (data as Cid).code, 
          label: (data as Cid).value 
        }
      ]

      setResults(normalized);
    })
    .catch(() =>{
      setResults([]);
    });

  }, 500);

  const handlerAddSelectedRef = () => {
    if(!allSavedRefs.includes(selectedRef)){
      setAllSavedRefs([...allSavedRefs, selectedRef]);
      queryCid(selectedRef).then(data => {
        setNameRefs([ ...nameRefs, data as Cid ]);
      });
    }
  }

  const handlerRemoveRefItem = (itemRef: string) => {
    const filterItems = allSavedRefs.filter(ref => ref !== itemRef);
    const filterNames = nameRefs.filter(ref => ref.code !== itemRef);
    setAllSavedRefs(filterItems);
    setNameRefs(filterNames);
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
      <input type="hidden" name="CID" value={allSavedRefs.slice(0)} />

      <div className="flex gap-x-3 items-center justify-between mb-6">
        <InputField
          className="my-0 w-full"
          textLabel="Nome ou Código CID 10"
          placeholder="Descreva com precisão"
          onChange={handlerSearchByReference}
        />

        <div className="flex gap-x-3 items-center mt-6">
          <SelectionCID 
            options={results}
            onChange={e => setSelectedRef(e.target.value)} 
          />

          <Button
            className="!mt-0" 
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
          {nameRefs.map((e, i) => (
            <li key={i} className="flex gap-x-3 bg-gray-200 p-2 mb-2 rounded justify-between">
              <div className="flex gap-x-3">
                <span className="font-bold">{e.code}</span>
                <span title={e.value} className="line-clamp-1">{e.value}</span>
              </div>
              <button 
                type="button" 
                onClick={()=>handlerRemoveRefItem(e.code)}
                className="px-2 bg-red-500 text-white rounded"
              >
                <RiDeleteBin6Line />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}