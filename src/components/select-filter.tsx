"use client";

import { 
  useEffect,
  useState,
  useRef, 
  ChangeEvent
} from "react";
import { 
  useRouter, 
  usePathname, 
  useSearchParams
} from "next/navigation";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import { getDoctors } from "@/app/backend/api/clinical/api";

type SelectFilterProps = {
  unitType?: "laboratory" | "workplace" | "internment" | "imaging";
  label: string;
  doctor?:string;
  filterKey: string;
  defaultOptionLabel?: string;
};

export default function SelectFilter({
  unitType,
  label,
  filterKey,
  defaultOptionLabel
}:SelectFilterProps){
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams);
  const [ optionData, setOptionData ] = useState<SelectionOption[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>)=>{
    const optionId = e.target.value;
    
    if(!optionId)
      search.delete(filterKey);
    else 
      search.set(filterKey, optionId);

    router.push(`${pathname}?${search.toString()}`);
  }
  
  useEffect(()=>{
    if(unitType)
      getUnits(unitType, true)
      .then((data: unknown[]) => setOptionData(data as SelectionOption[]));
    else 
      getDoctors()
      .then((data: unknown[]) => setOptionData(data as SelectionOption[]));
  }, []);
  
  return (
    <form ref={formRef} className="flex items-center gap-3">
      <Selection
        options={optionData}
        label={label}
        defaultOptionLabel={defaultOptionLabel?defaultOptionLabel:"Todas"}
        onChange={onChangeHandler}
        className="w-96"
      />
    </form>
  );
}