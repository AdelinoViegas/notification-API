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

type ConnetionError = "ECONNREFUSED";

export interface CustonAxiosError extends Error {
  cause: { code: ConnetionError }
}

export interface MongoError extends Error { code: number }