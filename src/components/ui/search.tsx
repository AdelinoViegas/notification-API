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
    inputElement.value = "";
    search.delete(filterKey);
    router.push(`${pathname}?${search.toString()}`);
  }

  return(
    <div ref={divRef} className={className ? className : "flex w-96 items-end gap-3"}>
      <InputField
        className="my-0 grow"
        textLabel={label}
        placeholder={placeholder} 
        onChange={onChangeText}
        disabled={disabled}
      />
      <button
        onClick={handleClear}
        disabled={disabled}
        type="button"
        className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-100 active:bg-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        title="Limpar pesquisa"
      >
        <BackspaceIcon className="size-5" />
      </button>
    </div>
  );
}