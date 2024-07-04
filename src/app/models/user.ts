// src/app/models/user.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password?: string;
  token?: string;
  role?: string;
  photo?: string;
}
