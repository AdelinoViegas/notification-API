"use client";

import { useState } from "react";
import InputField from "@/components/ui/input-field";

export default function InputFilter(){
   const [, setValue] = useState("");
  return(
    <div>
        <InputField
          textLabel="Filtrar por Nome"
          type="search"
          placeholder="Buscar por Nome" 
          name="fullname"
          onChange={(e)=>setValue(e.target.value)}
        />
    </div>
  )
}