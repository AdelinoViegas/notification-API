import { getFile } from "@/backend/api/storage";

export default async function UserFileViewer({ id }:{ id: string }){
  try{
    const userFile = await getFile(id);
  
    return(
      <div>
        para ver o arquivo carregado
        <pre>
          {JSON.stringify(userFile, null, 2)}
        </pre>
      </div>
    );
  } catch {
    return(
      <div>
        Não foi possivel 
      </div>
    )
  }
}