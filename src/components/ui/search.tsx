"use client";

import { 
  useRouter, 
  usePathname, 
  useSearchParams 
} from "next/navigation";
import InputField from "@/components/ui/input-field";
import { BsBackspace as BackspaceIcon } from "react-icons/bs";
import Button from "@/components/ui/button";
import debounce from "debounce";
import { useRef } from "react";

type SearchProps = {
  filterKey: string;
  label: string;
  placeholder: string;
  className?:string;
}

export default function Search({
  filterKey,
  label,
  placeholder,
  className
}: SearchProps){
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  
  const onChangeText = debounce((e)=>{
    const value = e.target.value;

    if(!value)
      search.delete(filterKey);
    else
      search.set(filterKey, value);

    router.push(`${pathname}?${search.toString()}`);
  }, 1000);

  const handleClear = ()=>{
    const inputElement = divRef.current?.getElementsByTagName("input")[0] as HTMLInputElement;
    inputElement.value = "";
    search.delete(filterKey);
    router.push(`${pathname}?${search.toString()}`);
  }

  return(
    <div ref={divRef} className={className?className:"flex w-96 items-center gap-3"}>
      <InputField
        textLabel={label}
        placeholder={placeholder} 
        onChange={onChangeText}
      />
      <Button onClick={handleClear}>
        <BackspaceIcon className="size-6" />
      </Button>
    </div>
  )
}