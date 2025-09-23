"use client";

import { useCallback } from "react";
import { 
  usePathname, 
  useRouter 
} from "next/navigation";
import clsx from "clsx";

type TooltipProps = {
  data: {
    quantity: number;
    label?: string;
    id: string;
  }[];
};

export default function TooltipInOperatingRoom({data}: TooltipProps){
  const pathname = usePathname();
  const router = useRouter();
  console.log(data);
  const handleFilterButton = useCallback((priority: string)=>{
    if(priority === "all")
      return router.push(pathname);

    const searchParams = new URLSearchParams();
    searchParams.set("priority", priority);
    router.push(`${pathname}?${searchParams.toString()}`);
  }, [pathname, router]);

  return(
    <div>
      <label className="font-medium text-sm">Resumo</label>
      <ul className="flex gap-3">
      {data.map((item, index)=>(
        <li key={index}>
          <button 
            onClick={()=>handleFilterButton(item.id)} 
            className={clsx("text-sm self-center text-center select-none hover:cursor-pointer rounded-xl px-3 py-1.5 font-medium", item.id !== "all"?`active:bg-blue-500 bg-blue-400 text-white`:"text-black bg-gray-100 hover:bg-gray-200")}>
            {item.label}
            {" "}
            ({item.quantity})
          </button>
        </li>
        ))}
      </ul>
    </div>
  )
}