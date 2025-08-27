"use client";

import { 
  useRouter, 
  usePathname, 
  useSearchParams 
} from "next/navigation";
import { ChangeEvent } from "react";
import clsx from "clsx";
import { SelectionOption } from "@/components/ui/selection";

interface SelectionFilterProps extends React.InputHTMLAttributes<HTMLSelectElement>{
  filterKey: string;
  label: string;
  className?: string;
  defaultOptionLabel?: string;
  options: SelectionOption[];
};

export default function SelectionFilter({
  filterKey,
  label,
  options,
  defaultOptionLabel,
  className,
  ...rest
}: SelectionFilterProps){
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  
  const changeText = (el: ChangeEvent<HTMLSelectElement>)=>{
    const value = el.target.value;

    if(!value)
      search.delete(filterKey);
    else
      search.set(filterKey, value);

    router.push(`${pathname}?${search.toString()}`);
  }

  return(
    <div className={clsx("flex flex-col my-4 gap-y-1", className)}>
      <label className="text-xs font-medium">{label}</label>
      <select 
        onChange={changeText}
        {...rest} 
        className={clsx('disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 bg-white focus:border-blue-500 px-3 py-[6px] border rounded-md border-2 hover:bg-gray-100',
        { 
          'w-auto': !className,
        }
      )}>
        <option value="">{defaultOptionLabel?defaultOptionLabel:"Selecione"}</option>
        {options.map((props, index)=> 
          <option 
            key={index} 
            value={props._id?.toString()}
          >
            {props.label}
          </option>
        )}
      </select>
    </div>
  )
}