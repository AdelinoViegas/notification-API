"use client";

import { getFileById } from "@/backend/api/storage";
import UserViewerButton from "@/components/user-viewer-button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdWarning } from "react-icons/md";
import Alert from "./ui/alert";

type MyFile = Awaited<ReturnType<typeof getFileById>>;

export default function ViewUserFile({ id }:{ id: string }){
  const [ file, setFile ] = useState<MyFile>();
  const [ finalState, setFinalState ] = useState(false); 
  const baseUrl = new URL(process.env.NEXT_PUBLIC_STORAGE_URL as string).toString();

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
        <Alert type="warn" message="Serviço de arquivos indisponivel, tente mais tarde!" />
      }
    </>
  )
}