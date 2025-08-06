"use client";

import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

class FilterDateDate {
  #now() {
    return new Date();
  }

  #subtractDays(days:number) {
    const now = this.#now();
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return {
      from: past.toISOString(),
      to: now.toISOString()
    };
  }

  getLast24h() {
    return this.#subtractDays(1);
  }

  getLast3Day() {
    return this.#subtractDays(3);
  }

  getLast10Day() {
    return this.#subtractDays(10);
  }
}

export default function UrgencyFilter(){
  const defautlDate = new Date().toISOString().split('T')[0];
  const defaultFilters = new FilterDateDate();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handlerClick = (formdata:FormData)=>{
    const search = new URLSearchParams();

    const [ from, to, rangeIndex ] = [
      formdata.get("from") as string,
      formdata.get("to") as string,
      Number(formdata.get("range"))
    ];

    const range = (!!from && !!to)
    ? { from: (new Date(from)).toISOString(), to: (new Date(to)).toISOString() }
    : defaultsDays[rangeIndex];

    search.set("from", range.from);
    search.set("to", range.to);

    router.push([pathname,search.toString()].join("?"));
  }

  const defaultsDays = [
    { 
      label: "24h Atrás",
      ...defaultFilters.getLast24h()
    },
    {
      label: "3 dias Atrás",
      ...defaultFilters.getLast3Day()
    },
    {
      label: "10 dias Atrás",
      ...defaultFilters.getLast10Day()
    }
  ]
  return(
    <form action={(formData) => {
      handlerClick(formData);
    }} 
    className="flex gap-x-3 items-center"
    >
      <div className="flex flex-col">
        <label htmlFor="filter" className="text-sm">Atalho de dias</label>
        <select id="filter" name="range" className="px-3 py-1 border-2 border-primary/50 rounded-lg">
          {defaultsDays.map((props, index)=>(
            <option key={index} value={index}>{props.label}</option>
          ))}
        </select> 
      </div>

      <div className="flex gap-x-3">
        <InputField
          textLabel="Inicio"
          name="from"
          type="date"
        />  

        <InputField
          textLabel="Fim"
          name="to"
          type="date"
          max={defautlDate}
        />  
      </div> 
      <Button>Filtrar</Button>   
    </form>
  )
}