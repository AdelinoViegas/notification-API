"use client";

import { getFile } from "@/backend/api/storage";
import UserViewerButton from "@/components/user-viewer-button";
import { useEffect, useState } from "react";

type MyFile = Awaited<ReturnType<typeof getFile>>;

export default function ViewUserFile({ id }:{ id: string }){
  const [ file, setFile ] = useState<MyFile>();
  const baseUrl = new URL(process.env.NEXT_PUBLIC_STORAGE_URL as string).origin;

  useEffect(()=>{
    getFile(id)
    .then(data => {
      setFile(data);
    })
  }, []);

  return(
    <>
      { file &&  
        <UserViewerButton
          driveFile={{
            name: file.name,
            link: [baseUrl, file.link].join(""),
            size: file.size,
            extension: file.extension
          }}
        />
      }

      { !file && <>Carregando...</>}
    </>
  )
}