"use client";

import { getFile } from "@/backend/api/storage";
import UserViewerButton from "@/components/user-viewer-button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type MyFile = Awaited<ReturnType<typeof getFile>>;

export default function ViewUserFile({ id }:{ id: string }){
  const [ file, setFile ] = useState<MyFile>();
  const [ finalState, setFinalState ] = useState(false); 
  const baseUrl = new URL(process.env.NEXT_PUBLIC_STORAGE_URL as string).toString();

  useEffect(()=>{
    getFile(id).then(data => {
      setFile(data);
    })
    .catch(() => {
      toast.warn("Não foi possivel carregar os arquivos, tente mais tarde!");
      setFinalState(true);
    });
  }, []);

  return(
    <>
      { file &&  
        <UserViewerButton
          driveFile={{
            name: file.name,
            link: [baseUrl, file.uniqueName].join("/"),
            size: file.size,
            extension: file.extension
          }}
        />
      }

      { (!file && finalState) &&
        <div className="inline-flex px-3 py-2 rounded animate-pulse bg-orange-300 text-orange-950">
          { true && "Serviço de arquivos indisponivel..."}
        </div>
      }
    </>
  )
}