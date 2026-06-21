"use client";

import { getFileById } from "@/backend/api/storage";
import UserViewerButton from "@/components/user-viewer-button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type MyFile = Awaited<ReturnType<typeof getFileById>>;

export default function ViewUserFile({ id }:{ id: string }){
  const [ file, setFile ] = useState<MyFile>();
  const [ finalState, setFinalState ] = useState(false); 
  const baseUrl = new URL(process.env.NEXT_PUBLIC_STORAGE_URL as string).toString();

  useEffect(() => {
    getFileById(id)
      .then(data => { console.log({ data }); setFile(data)})
      .catch(() => {
        toast.warn("Não foi possivel carregar os arquivos, tente mais tarde!");
        setFinalState(true);
      });
  }, [id]);

  return(
    <>
      { (file && "linkPathname" in file) &&  
        <UserViewerButton
          driveFile={{
            name: file.metadata.name,
            link: [baseUrl, file.linkPathname].join(""),
            size: file.metadata.humanSize,
            extension: file.name.split(".")[1]
          }}
        />
      }

      { (!file && finalState) &&
        <div className="inline-flex px-3 py-2 rounded animate-pulse bg-orange-300 text-orange-950 mt-3">
          { true && "Serviço de arquivos indisponivel..."}
        </div>
      }
    </>
  )
}