"use client";

import Button from "@/components/ui/button";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ButtonEdit({
  state,
  setState,
  value,
  location,
}:{
  location: string[],
  value: (string | boolean)[],
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
            Salvar
          </Button>
        </>
      }

      {data && value.length > 0 && 
        <>
          <Button className={clsx((location.length === 1 || (location.length === value.length && value.length > 0)) && "hidden")}>
            Salvar
          </Button>
          <Button 
            className="bg-slate-700" 
            type="button" 
            onClick={handle}
          >
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
          Cancelar
        </Button>
        <Button name="update" data-location={JSON.stringify(location)}>
          Actualizar
        </Button>
        </>
      }
    </div>
  );
}