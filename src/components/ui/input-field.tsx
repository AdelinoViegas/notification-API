"use client";

import { useRef } from "react";
import clsx from "clsx";
import { IoEye } from "react-icons/io5";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
  textLabel?: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function InputField({
  textLabel,
  className,
  ref,
  ...rest
}: InputFieldProps){
  const inputRef = useRef<HTMLInputElement>(null);

  const changeVeiwPassword = ()=>{
    inputRef.current?.setAttribute("type", inputRef.current?.type === "password"?"text":"password");
  }
  
  return(
    <div className={clsx(className, "my-3")}>
      <label className={clsx((rest.type === "radio" || rest.type === "checkbox") && "flex items-center gap-3 select-none")}>
        <span className="text-xs font-medium">{textLabel}</span>
        <div className="flex gap-3 border px-3 py-1 rounded-md has-[:disabled]:bg-gray-100">
          <input 
            ref={ref?ref:inputRef} 
            {...rest} 
            className="disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 w-full outline-none placeholder:text-sm placeholder:font-medium" 
          />

          {rest.type === "password" && !rest.disabled &&
            <button 
              className="z-50 hover:bg-gray-200 rounded-full px-1" 
              type="button" 
              onClick={changeVeiwPassword}
            >
              <IoEye className="size-5"/>
            </button>
          }
        </div>
      </label>
    </div>
  );
}