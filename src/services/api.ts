import { User, Role, UpdateUserRolesRequest } from "@/types/user";

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    roles: ["Admin", "Editor"]
  },
  {
    id: "2", 
    name: "Bob Smith",
    email: "bob.smith@company.com",
    roles: ["Editor"]
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@company.com", 
    roles: ["Viewer"]
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@company.com",
    roles: ["Admin", "Editor", "Viewer"]
  },
  {
    id: "5",
    name: "Eva Brown",
    email: "eva.brown@company.com",
    roles: ["Editor", "Viewer"]
  }
];

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access and user management"
  },
  {
    id: "editor", 
    name: "Editor",
    description: "Can create and edit content"
  },
  {
    id: "viewer",
    name: "Viewer", 
    description: "Read-only access to content"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getUsers(): Promise<User[]> {
    await delay(800); // Simulate network delay
    return [...mockUsers];
  },

  async getRoles(): Promise<Role[]> {
    await delay(300);
    return [...mockRoles];
  },

  async updateUserRoles(request: UpdateUserRolesRequest): Promise<User> {
    await delay(500);
    
    // Simulate occasional API failures for demo
    if (Math.random() < 0.1) {
      throw new Error("Failed to update user roles. Please try again.");
    }

    const userIndex = mockUsers.findIndex(u => u.id === request.userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      roles: [...request.roles]
    };

    return { ...mockUsers[userIndex] };
  }
};