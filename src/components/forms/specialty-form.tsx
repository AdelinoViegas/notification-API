"use client";

import InputField from "@/components/ui/input-field"
import Button from "@/components/ui/button"
import Selection, { SelectionOption } from "@/components/ui/selection"
//import { useState } from "react";

export default function SpecialtyForm({
  role
}:{role:SelectionOption[]}){
  //const [nameSpecialty, setNameSpecialty] = useState("");
  //const [nameDoctors, setNameDoctors] = useState<SelectionOption[]>();

  return(
    <form>
    <Selection
      label="Selecione a especialidade"
      name="specialty"
      options={role}
      required
    />
    {/*onChange={''/*(e)=>setNameSpecialty(e.target.value)*/}

    <Selection
      label="Nome do Médico" 
      name="doctorName"
      options={[]}
      placeholder="Digite o nome completo"
      required
    />

    <InputField
      textLabel="Dias disponiveis para consulta"
      type="date" 
      name="time"
      required
    />

    <Button>Agendar</Button>
  </form>
  )
}