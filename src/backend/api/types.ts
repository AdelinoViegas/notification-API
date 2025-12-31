export interface User {
  _id: string;
  fullname: string;
  username: string;
  group: { name: string }
}

export interface UserRole {
  _id: string;
  role: {
    name: string;
    path: string;
  }
}

export interface MyProfile {
  _id: string;
  fullname: string;
  tel: string;
  email: string;
  group: { name: string }
}

export interface DefaultResponse {
  message: string;
  status: string;
}

export interface FileResponse {
  message: string;
  id: string;
}

export interface DriveFile {
  _id: string;
  authorId: string;
  name: string;
}

export interface ListAllFiles {
  items: Array<DriveFile>;
  total: number;
  page: number;
  currentPage: number;
  totalPages: number;
}

export interface ResponseDriveFile {
  link: string;
  name: string;
  size: string;
  extension: "png" | "jpeg" | "png" | "mp4" | "pdf";
  uniqueName: string;
}

export type CidResponse = {
  code: string;
  value: string;
}

export interface PublicDriveFile extends ResponseDriveFile {
  size: string;
  type: "png" | "jpeg" | "pdf" | "mp4";
}

type ConnetionError = "ECONNREFUSED";

export interface CustonAxiosError extends Error {
  cause: { code: ConnetionError }
}