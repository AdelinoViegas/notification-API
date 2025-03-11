"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/button";
import { MdOutlineModeEdit  } from "react-icons/md";

export type SimpleTable = {
  _id: string; 
  name: string;
};

export default function CCG(){
  const router = useRouter();
  const pathname = usePathname();
  const handlePress = (type: "category" | "classification" | "group")=>{
    router.push(`${pathname}/ccg/${type}`);
  }
  
  return(
    <div className="flex gap-3">
      <Button 
        className="flex gap-3" 
        onClick={()=>handlePress('category')}>
        <MdOutlineModeEdit className="w-5" />
        Categoria
      </Button>

      <Button 
        className="flex gap-3" 
        onClick={()=>handlePress('classification')}>
        <MdOutlineModeEdit className="w-5" />
        Classificação
      </Button>

      <Button 
        className="flex gap-3" 
        onClick={()=>handlePress('group')}>
        <MdOutlineModeEdit className="w-5" />
        Grupo
      </Button>
    </div>
  );
}