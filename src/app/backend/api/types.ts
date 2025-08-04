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
  fullname: string;
  tel: string;
  email: string;
  group: { name: string }
}