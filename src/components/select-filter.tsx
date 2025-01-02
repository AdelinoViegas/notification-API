"use client";

import { 
  useEffect,
  useState,
  useRef 
} from "react";
import { 
  useRouter, 
  usePathname, 
  useSearchParams
} from "next/navigation";
import Selection, { SimpleSelectionType } from "@/components/ui/selection";
import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import { getDoctors } from "@/app/backend/api/clinical/api";

type SelectFilterProps = {
  unitType?: "laboratory" | "workplace" | "internment";
  label: string;
  doctor?:string;
  filterKey: string;
  defaultOptionLabel?: string;
};

export default function SelectFilter({
  unitType,
  label,
  doctor,
  filterKey,
  defaultOptionLabel
}:SelectFilterProps){
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams);
  const [ optionData, setOptionData ] = useState<SimpleSelectionType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const onChangeHandler = (e: unknown)=>{
    const optionId = (e as { target: { value: string }}).target.value;
    
    if(!optionId)
      search.delete(filterKey);
    else 
      search.set(filterKey, optionId);

    router.push(`${pathname}?${search.toString()}`);
  }
  
  useEffect(()=>{
    if(unitType)
      getUnits(unitType, true)
      .then((data: unknown[]) => setOptionData(data as SimpleSelectionType[]));
    else 
      getDoctors()
      .then((data: unknown[]) => setOptionData(data as SimpleSelectionType[]))
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