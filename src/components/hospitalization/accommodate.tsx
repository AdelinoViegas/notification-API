"use client";

import Selection from "@/components/ui/selection";
import Button from "../ui/button";

export default function Accommodate({ }: { id: string }){

  return(
    <form>
      <Selection
        label="Ala"
        name="section"
        options={[]} 
      />

      <Selection
        label="Enfermagem"
        name="nursing"
        options={[]} 
      />

      <Selection
        label="Nº da Cama"
        name="bed"
        options={[]} 
      />

      <Button>Salvar</Button>
    </form>
  )
}