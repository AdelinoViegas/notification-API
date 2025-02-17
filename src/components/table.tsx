"use client";

import { 
  useRouter, 
  usePathname,
} from "next/navigation";
import clsx from "clsx";
import { priority } from "@/app/backend/api/clinical/translator";

export type TableRow = {
  id: string;
  row: string[]
};

type TableProps = {
  columns: string[];
  rows: TableRow[],
  baseRowLink?: string;
  rowLength?: number;
  status?: boolean;
  priorityCol?: boolean;
  isEdit?: boolean;
  searchParams?: string;
};

export default function Table({
  columns,
  rows,
  baseRowLink,
  rowLength,
  priorityCol,
  isEdit,
  searchParams
}:TableProps){
  const { push } = useRouter();
  const pathname = usePathname();

  const handleDoubleClick = (rowId: string)=>{
    if(isEdit)
      push(`${baseRowLink}/edit?id=${rowId}`);

    if(baseRowLink)
      push(`${baseRowLink}/${rowId}`);

    if(searchParams){
      const search = new URLSearchParams();
      search.set("id", rowId);
      search.set("modal", '1');
      search.set("type", searchParams); // type é o CCGTypes
      push(`${pathname}?${search.toString()}`);
    }
  }
  
  return(
    <>
      <div className="shadow-sm border my-3 rounded-xl max-h-[32rem] lg:max-h-[32rem] auto:max-h-[65vh] overflow-y-auto scroll">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-primary text-white">
              {columns.map((props, index)=>(
                <th key={index} className="border-b font-bold px-3 py-2">{props}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {!rows.length && 
              <tr>
                <td className="py-4 font-medium" colSpan={rowLength?rowLength:5}>Sem registro</td>
              </tr>
            }
          { rows.map((rowProps, rowIndex)=>{
            return(
            <tr 
              title={baseRowLink?"Duplo click para continuar com o processo!":"Somente visualisação"} 
              onDoubleClick={()=>handleDoubleClick(rowProps.id)}
              key={rowIndex} 
              className={clsx("hover:bg-primary/15 ",
                {"hover:cursor-not-allowed": !baseRowLink},
                {"hover:cursor-pointer": baseRowLink}
              )}>
              {rowProps.row.map((props, columnIndex)=>{
                return(
                  <td key={columnIndex} className={clsx("select-none border-b border-gray-300 pl-3 py-4",
                    { 
                      "font-medium": columnIndex === 0,
                      "border-none": rows.length - 1 == rowIndex,
                    },
                    priorityCol && columnIndex === 0 && {
                      "text-white": true,
                      "bg-blue-500": priority.find((item)=>item.label === props)?._id === "blue",
                      "bg-green-500": priority.find((item)=>item.label === props)?._id === "green",
                      "bg-yellow-500": priority.find((item)=>item.label === props)?._id === "yellow",
                      "bg-orange-600": priority.find((item)=>item.label === props)?._id === "orange",
                      "bg-red-500 animate-pulse": priority.find((item)=>item.label === props)?._id === "red"
                    }
                  )}>{props}</td>
                );
            })}
            </tr>
            )})}
          </tbody>
        </table>
      </div>
    </>
  )
}