"use client";
import { useCallback, useState } from "react";
import { SimpleSelectionType } from "@/components/ui/selection";

type Item = SimpleSelectionType;

type CheckBoxProps = {
  label: string;
  items: Item[];
};

export default function CheckBox({
  label,
  items,
}: CheckBoxProps){

  const [ exams, setExams ] = useState<Item[]>([]);

  const handleClick = useCallback((item: Item)=>{
    if(exams.find((props)=> props._id === item._id)){
      setExams(exams.filter((props)=>props._id !== item._id));
      return;
    }
    setExams([...exams, item]);
  }, [exams]);

  return(
    <div>
      <label className="text-xs font-medium">{label}</label>
      { !items.length &&
        <p className="my-3">Sem exames cadastrado!</p> 
      }
      <div className="flex flex-wrap gap-3">
        {items.map((item, index)=>(
          <div key={index} className="flex gap-3 border-2 border-gray-300 bg-gray-200 px-3 py-2 rounded-md justify-between">
            <p className="text-sm font-medium">{item.label.toUpperCase()}</p>
            <input className="size-5 ring-0" onClick={()=>handleClick(item)} type="checkbox" {...item} name="" />
          </div>
        ))}
      </div>
      <input 
        type="hidden" 
        name="choosedExams"
        defaultValue={JSON.stringify(exams)} 
      />
    </div>
  )
}