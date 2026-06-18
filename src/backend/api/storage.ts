"use server";

import { getServiceToken } from "@/lib/web-token";
import { FetchService } from "@/lib/fetch";

interface DriveFile {
  name: string;
  linkPathname: string;
  metadata: {
    name: string;
    size: string;
    type: string;
    humanSize: string;
  }
}

interface FileError {
  message: string;
  error: string;
}

interface CidData {
  code: string;
  value: string;
}

interface CidDataItems {
  items: CidData[];
  total: number;
}

interface UploadedFile {
  data: { id: string; link: string },
  message: string;
}

// 1. Instanciamos o serviço APENAS com a URL base. Os cabeçalhos dinâmicos entram nas requisições.
const getApiClient = async () => {
  const token = await getServiceToken();
  return new FetchService({
    url: process.env.API_URL as string,
    base: "/st/v2",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export async function upload(params: FormData, authorId: string){
  try{
    const api = await getApiClient(); // Garante o token atualizado nesta chamada
    
    const data = await api.post<UploadedFile | FileError>("/uploads", params, {
      headers: { 
        "x-auth-author-id": authorId,
        "x-forwarded-uri": "/v2/uploads"
      }
    });

    return data;
  }catch(e){
    console.error("Erro no upload da API:", e);
    return null;
  }
}

export async function getAllFiles(){
  try {
    const api = await getApiClient();
    return await api.get("/files", {
      headers: { "x-forwarded-uri": "/v2/files" }
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getFileById(id: string){
  try{
    const api = await getApiClient();
    const data = await api.get<DriveFile | FileError>(`/files/${id}`, {
      headers: { "x-forwarded-uri": "/v2/files/:id" }
    });

    return data;
  }catch(e){
    console.error(e);
    return null;
  }
}

export async function queryCid(ref: string){
  try{
    const api = await getApiClient();
    return await api.get<CidData | CidDataItems>(`/cid/10/${ref}`);
  }catch (e){
    console.error(e);
    return null;
  }
}