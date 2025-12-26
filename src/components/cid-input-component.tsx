"use client";

import InputField from "./ui/input-field";
import Selection from "./ui/selection";

export default function CidInputComponent({ }: { defaultValue?: string }){

  return (
    <div>
      <InputField
        textLabel="Nome ou Código CID 10"
        placeholder="Descreva com precisão a referência da CID 10 ou o código"
    
      />
    </div>
  )
}