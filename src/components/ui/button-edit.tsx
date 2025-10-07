"use client";

import Button from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdOutlineCancel, MdOutlineModeEdit, MdOutlineSaveAlt, MdSystemUpdateAlt } from "react-icons/md";


export default function ButtonEdit({
  state,
  setState,
  value,
  location,
}:{
  location: string,
  state: Record<string, boolean>;
  setState: Dispatch<SetStateAction<Record<string, boolean>>>;
  value: string,
}){
  const [data, setData] = useState(false); 
  console.log(data);
useEffect(() => {
  setData(state[location]);
}, [state, location]);

  return (
    <div className="flex gap-x-2">
      {data && !value && 
        <>
          <Button>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>
        </>
      }

      {data && value && 
        <>
          {/*<Button>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>*/}
          <Button 
            className="bg-slate-700" 
            type="button" 
            onClick={()=> setState( prev => ({...prev, [location]: !prev[location]}))}
          >
            <MdOutlineModeEdit className="w-5" /> 
            Editar
          </Button>                   
        </>
      }

      {!data && <>
        <Button 
          type="button" 
            onClick={()=> setState( prev => ({...prev, [location]: !prev[location]}))}
          cancel
        >
          <MdOutlineCancel className="w-5"/>
          Cancelar
        </Button>
        <Button name="update" data-location={location}>
          <MdSystemUpdateAlt className="w-5"/>
          Actualizar
        </Button>
        </>
      }
    </div>
  );
}