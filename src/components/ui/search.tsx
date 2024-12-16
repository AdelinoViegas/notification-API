"use client";

import { useRouter, usePathname } from "next/navigation";
import InputField from "@/components/ui/input-field";
import { BackspaceIcon } from "@heroicons/react/24/outline";
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
  const searchParams = new URLSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  
  const onChangeText = debounce((e)=>{
    if(!e.target.value){
      return router.replace(pathname);
    }
    searchParams.set(filterKey, e.target.value);
    router.push(`${pathname}?${searchParams.toString()}`);
  }, 1000);

  const handleClear = ()=>{
    const inputElement = divRef.current?.getElementsByTagName("input")[0] as HTMLInputElement;
    inputElement.value = "";
    router.push(pathname);
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