"use client";

import { ChangeEvent } from "react";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";

export default function UploadPhoto(){
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>)=>{
     console.log(event);
  }

  return(
    <div className="flex items-center gap-x-4">
      <div className="flex justify-center items-center border w-[300px] h-[300px] bg-gray-300 text-2xl font-black rounded-lg">
        <span>Exemplo</span>
      </div>
      <div>
        <InputField 
          type="file"
          onChange={handleImageUpload}
        />
        <Button>Carregar Foto</Button>
      </div>
    </div>
  )
}