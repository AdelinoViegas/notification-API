"use client";

import clsx from "clsx";
import InputField from "@/components/ui/input-field";
import Selection,{ SimpleSelectionType } from "@/components/ui/selection";
import Button from "@/components/ui/button";

const user:SimpleSelectionType[] = [
  {
   _id:'GF',
   label:'Gildo Francisco',
  },
  {
    _id:'AV',
    label:'Adelino Viegas', 
  },
  {
    _id:'CM',
    label:'Cristo Muaco', 
  },
];

const medicalUser:SimpleSelectionType[] = [
  {
   _id:'GF',
   label:'Dr.Gildo Francisco',
  },
  {
    _id:'AV',
    label:'Dr.Adelino Viegas', 
  },
  {
    _id:'CM',
    label:'Dr.Cristo Muaco', 
  },
];

const specialty:SimpleSelectionType[] = [
  {
   _id:'masculine',
   label:'Cardiologia',
  },
  {
    _id:'default',
    label:'Medicina Geral', 
  },
  {
    _id:'default',
    label:'Pediatria', 
  },
  {
    _id:'default',
    label:'urologia', 
  },
  {
    _id:'default',
    label:'dermatologia', 
  },
  {
    _id:'default',
    label:"Gastroenterologia",
  }
]

export default function ScheduleAppointment(){

  return(
    <div>

      <div className={clsx(
        "grid md:grid-cols-2 large:grid-cols-3 gap-3"
      )}>
        <Selection
          options={user}
          label="Escolha o Utente" 
          name="gender"
          className="w-full"
          required
        />

        <Selection
          options={specialty}
          label="Escolha a especialidade" 
          name="gender"
          className="w-full"
          required
        />

        <Selection
          options={medicalUser}
          label="Escolha o médico" 
          name="gender"
          className="w-full"
          required
        />

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