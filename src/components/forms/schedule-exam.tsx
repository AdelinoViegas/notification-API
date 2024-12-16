"use client";

import clsx from "clsx";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";

export default function ScheduleExam(){
  return(
    <div>
      <div className={clsx(
        "grid md:grid-cols-2 large:grid-cols-3 gap-3"
      )}>

        <InputField
          textLabel="Data da Consulta"
          name="consult" 
          type="date"
        />
      </div>
      
      <div className="flex gap-x-2">
        <Button>Agendar</Button>
        <Button className="bg-slate-600">ver consultas agendadas</Button>
      </div>
    </div>
  );
}