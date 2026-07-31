"use client";

import { 
  useRouter, 
  usePathname, 
  useSearchParams 
} from "next/navigation";
import { BsBackspace as BackspaceIcon } from "react-icons/bs";
import { ChangeEvent, useRef } from "react";
import debounce from "debounce";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import clsx from "clsx";

type SearchProps = {
  filterKey: string;
  label: string;
  placeholder: string;
  className?:string;
  disabled?: boolean;
}

export default function Search({
  filterKey,
  label,
  placeholder,
  className,
  disabled
}: SearchProps){
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  
  const onChangeText = debounce((el: ChangeEvent<HTMLInputElement>)=>{
    const value = el.target.value;

    if(!value)
      search.delete(filterKey);
    else
      search.set(filterKey, value);

    router.push(`${pathname}?${search.toString()}`);
  }, 1000);

  const handleClear = ()=>{
    const inputElement = divRef.current?.getElementsByTagName("input")[0] as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
    search.delete(filterKey);
    router.push(`${pathname}?${search.toString()}`);
  }

  return(
    <div ref={divRef} className={clsx("flex flex-col gap-1", className)}>
      {label && <span className="text-xs font-medium">{label}</span>}
      <div className="flex items-center gap-2">
        <InputField
          className="my-0 flex-1"
          placeholder={placeholder} 
          onChange={onChangeText}
          disabled={disabled}
        />
        <Button 
          type="button"
          onClick={handleClear} 
          disabled={disabled}
          className="!mt-0 h-[34px] px-3 bg-primary hover:opacity-90 active:opacity-80 text-white flex-shrink-0"
          title="Limpar filtro"
        >
          <BackspaceIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}