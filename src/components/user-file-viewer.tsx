import { getFile } from "@/app/backend/api/storage";

export default async function UserFileViewer({ id }:{ id: string }){
  const userFile = await getFile(id);
  
  return(
    <div>
      para ver o arquivo carregado
      {JSON.stringify(userFile)}
    </div>
  )
}