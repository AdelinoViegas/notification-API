"use client";

import { getFileById, getFileUrl } from "@/backend/api/storage";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Alert from "@/components/ui/alert";
import { FaRegFile } from "react-icons/fa";

type MyFile = Awaited<ReturnType<typeof getFileById>>;

export default function ViewUserFile({ id }:{ id: string }){
  const [ file, setFile ] = useState<MyFile>();
  const [ finalState, setFinalState ] = useState(false); 

  useEffect(() => {
    getFileById(id)
      .then(data => setFile(data))
      .catch(() => {
        toast.warn("Lamentamos, mas não foi possivel carregar o arquivo, tente mais tarde!", { autoClose: 7000 });
        setFinalState(true);
      });
  }, [id]);

  return(
    <>
      { file && 
        <FileButton 
          id={file.id} 
          name={file.name} 
          size={file.size} 
        /> 
      }

      { (!file && finalState) &&
        <Alert type="warn" message="Serviço de arquivos indisponivel, tente mais tarde!" />
      }
    </>
  )
}

function FileButton(params: {
  id: string;
  name: string;
  size: string;
}){
  const buttonHandler = () => {
    getFileUrl(params.id)
      .then(data => window.open(data))
      .catch(() => {
        toast.warn("Não foi possivel abrir o arquivo!", { autoClose: 7000 });
      });
  }
  return (
    <div className="inline-flex flex gap-x-3 border border-gray-300 py-1 px-2 items-center rounded bg-gray-200">
      <FaRegFile className="size-8" />
      <div>
        <p>{params.name}</p>
        <p className="text-sm font-bold">{params.size}</p>
      </div>
      <button 
        type="button" 
        className="hover:bg-primary/80 bg-primary text-white px-2 py-1 text-sm font-medium rounded"
        onClick={buttonHandler}
      >
        Ver
      </button>
    </div>
  )
}