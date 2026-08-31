export interface AuthUser {
  id: string;
  fullname: string;
  email: string | null;
  tel: string | null;
  group: {
    id: string;
    name: string;
    baseUrl: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}