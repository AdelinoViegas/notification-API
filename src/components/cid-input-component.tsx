"use client";

import InputField from "./ui/input-field";
import Selection from "./ui/selection";
import debounce from "debounce";
export default function CidInputComponent({ }: { defaultValue?: string }){

  const handlerSearchByReference = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.value);
  }, 500);

  return (
    <div>
      <InputField
        textLabel="Nome ou Código CID 10"
        placeholder="Descreva com precisão a referência da CID 10 ou o código"
        onChange={handlerSearchByReference}
      />
    </div>
  )
}