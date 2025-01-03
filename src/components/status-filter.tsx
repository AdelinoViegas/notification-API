"use client";

import { 
  useEffect,
  useState,
  useRef,
} from "react";
import { 
  useRouter, 
  usePathname, 
} from "next/navigation";
import Selection, { SelectionOption } from "@/components/ui/selection";

type SelectFilterProps = {
  label: string;
};

export default function StatusFilter({
  label,
}:SelectFilterProps){
  const [ options, setOptions ] = useState<SelectionOption[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handler = async()=>{ 
      const options:SelectionOption[] = [];
      options.push(
        {_id:"Confirmed",label:"Confirmado"},
        {_id:"Pending",label:"Pendente"}
      );

     setOptions(options);
  }

  const action = ()=>{
    const selectElement = formRef.current?.elements?.item(0) as HTMLSelectElement;
    const params = new URLSearchParams(window.location.search);

    if(!selectElement.value){
     return router.push(pathname);
    }

    params.set("state", selectElement.value);
    const url = `${pathname}?${params.toString()}`;
    router.push(url);
  }

  useEffect(()=>{
    handler();
  }, []);
  
  if(options){
    return(
      <form ref={formRef} className="flex items-center gap-3">
        <Selection
          options={options}
          label={label}
          defaultOptionLabel="Todas"
          onChange={action}
          className="w-96"
        />
      </form>
    )
  }else{
    return(
      <form ref={formRef} className="flex items-center gap-3">
        <Selection
          options={options}
          label={label}
          defaultOptionLabel="Todas"
          onChange={action}
          className="w-96"
        />
      </form>
    )
  }
}