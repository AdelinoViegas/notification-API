export interface User {
  id: string;
  fullname: string;
  username: string;
  group: { name: string },
  createdAt: Date;
}

export interface UserRole {
  id: string;
  name: string;
  resource: string;
}

export interface MyProfile {
  id: string;
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
  id: string;
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