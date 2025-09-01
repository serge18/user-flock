export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UpdateUserRolesRequest {
  userId: string;
  roles: string[];
}