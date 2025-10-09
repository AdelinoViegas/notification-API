"use client";

import Button from "@/components/ui/button";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdOutlineCancel, MdOutlineModeEdit, MdOutlineSaveAlt, MdSystemUpdateAlt } from "react-icons/md";


export default function ButtonEdit({
  state,
  setState,
  value,
  location,
}:{
  location: string[],
  value: string[],
  state: Record<string, boolean>,
  setState: Dispatch<SetStateAction<Record<string, boolean>>>,
}){
  const [data, setData] = useState(true); 

  useEffect(() => {
    setData(state[location[0]]);
  }, [state, location]);
  
  const handle = ()=> {
    for(const value of location)
      setState( prev => ({...prev, [value]: !prev[value]}))
  }

  return (
    <div className="flex gap-x-2">
      {data && value.length === 0 && 
        <>
          <Button>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>
        </>
      }

      {data && value.length > 0 && 
        <>
          <Button className={clsx((location.length === 1 || (location.length === value.length && value.length > 0)) && "hidden")}>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>
          <Button 
            className="bg-slate-700" 
            type="button" 
            onClick={handle}
          >
            <MdOutlineModeEdit className="w-5" /> 
            Editar
          </Button>                   
        </>
      }

      {!data && <>
        <Button 
          type="button" 
            onClick={handle}
          cancel
        >
          <MdOutlineCancel className="w-5"/>
          Cancelar
        </Button>
        <Button name="update" data-location={JSON.stringify(location)}>
          <MdSystemUpdateAlt className="w-5"/>
          Actualizar
        </Button>
        </>
      }
    </div>
  );
}