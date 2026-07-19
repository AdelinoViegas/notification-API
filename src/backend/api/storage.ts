"use server";

import { getServiceToken, getUserId } from "@/lib/web-token";
import { FetchService } from "@/lib/fetch";
import { error } from "@/lib/storage-errors";

interface StorageFile {
  id: string;
  name: string;
  status: "PEDING" | "UPLOADED",
  authorId: string,
  Metadata: {
    name: string;
    type: string;
  };
  size: string;
}

interface FileError {
  message: string;
  error: string;
}

interface UnavaliableServiceError {
  status: number;
  message: string;
  detail: string;
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
  id: string;
  url: string;
  key: string;
}

interface UpdatedFileState {
  id: string;
  data: boolean;
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
    const file = params.get("file") as File;
    if(!file) return error.EMPTY_PAYLOAD;

    const api = await getApiClient(); // Garante o token atualizado nesta chamada
    const preAssignedUrl = await api.post<UploadedFile | FileError>("/s3", {
      authorId,
      service: "erp-clinical-service",
      filename: file.name,
      contentType: file.type,
      metadata: {
        mimetype: file.type,
        size: file.size
      }
    });

    if("error" in preAssignedUrl) return error.PRE_ASSIGNED_URL;
    
    console.info(preAssignedUrl);

    const uploadedFile = await fetch(preAssignedUrl.url, {
      method: "PUT",
      body: params
    });

    if(uploadedFile.status != 200) return error.S3_FILE_UPLOAD; 
    
    const updatedFileState = await api.patch<UpdatedFileState | FileError>(`/files/${preAssignedUrl.id}`, 
      { omit: { headers: ["content-type"]}}
    );
    
    if("error" in updatedFileState) return error.UPDATE_FILE_STATE;

    return { id: updatedFileState.id };
  }catch(e){
    const err = e as UnavaliableServiceError;
    console.error(err);

    switch(err.status) {
      case 502:
        return error.SERVICE_UNAVIABLE;
      default: 
        return error.UNKNOWN_ERROR;
    }
  }
}

export async function getAllFiles(){
  try {
    const api = await getApiClient();
    const data = await api.get("/files");

    console.log(data);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getFileById(id: string){
  try{
    const api = await getApiClient();
    const data = await api.get<StorageFile | FileError>(`/files/${id}`);

    if("error" in data) throw new Error(data.message);
  
    return { 
      id: data.id,
      name: data.Metadata.name,
      size: data.size
    }
  }catch(e){
    const err = e as UnavaliableServiceError;
    return Promise.reject(err);
  }
}

export async function getFileUrl(id: string){
  try{
    const api = await getApiClient();
    const data = await api.get<{ data: string } | FileError>(`/files/${id}/link`);

    if("error" in data) throw new Error(data.message);
  
    return data.data;
  }catch(e){
    const err = e as UnavaliableServiceError;
    return Promise.reject(err);
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

export async function serviceUpload(formData: FormData, fileField: string = "file"){
  const uploadPayload = new FormData();
  uploadPayload.append("file", formData.get(fileField) as File);

  const userId = await getUserId();
  const data = await upload(uploadPayload, userId);
  
  switch (data) {
    case error.EMPTY_PAYLOAD:
      return {
        status: false,
        error: true,
        message: "Nenhum arquivo foi enviado.",
      };

    case error.PRE_ASSIGNED_URL:
      return {
        status: false,
        error: true,
        message: "Erro ao gerar a URL de upload.",
      };

    case error.S3_FILE_UPLOAD:
      return {
        status: false,
        error: true,
        message: "Falha ao enviar o arquivo para o armazenamento.",
      };

    case error.UPDATE_FILE_STATE:
      return {
        status: false,
        error: true,
        message: "Falha ao atualizar o estado do arquivo.",
      };
  }

  if(typeof data == "number") 
    return  {
      status: false,
      error: true,
      message: "Impossivel de concluir a operação!"
    }

  return data;
}