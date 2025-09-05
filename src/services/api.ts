import { User, Role, UpdateUserRolesRequest } from "@/types/user";

// Cache for parsed data
let usersCache: User[] | null = null;
let rolesCache: Role[] | null = null;

// Parse JSON to get users
async function parseUsersJSON(): Promise<User[]> {
  if (usersCache) return usersCache;
  
  const response = await fetch('/users.json');
  const users: User[] = await response.json();
  
  usersCache = users;
  return users;
}

// Parse JSON to get roles
async function parseRolesJSON(): Promise<Role[]> {
  if (rolesCache) return rolesCache;
  
  const response = await fetch('/roles.json');
  const roles: Role[] = await response.json();
  
  rolesCache = roles;
  return roles;
}

// Save users to JSON file
async function saveUsersToJSON(users: User[]): Promise<void> {
  const jsonContent = JSON.stringify(users, null, 2);
  
  // In a real app, this would save to the server
  // For now, we'll just simulate the save operation
  console.log('Saving users to JSON:', jsonContent);
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getUsers(): Promise<User[]> {
    await delay(800); // Simulate network delay
    return await parseUsersJSON();
  },

  async getRoles(): Promise<Role[]> {
    await delay(300);
    return await parseRolesJSON();
  },

  async updateUserRoles(request: UpdateUserRolesRequest): Promise<User> {
    await delay(500);
    
    // Simulate occasional API failures for demo
    if (Math.random() < 0.05) {
      throw new Error("Failed to update user roles. Please try again.");
    }

    const users = await parseUsersJSON();
    const userIndex = users.findIndex(u => u.id === request.userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user roles
    users[userIndex].roles = [...request.roles];

    // Save updated users back to JSON file
    await saveUsersToJSON(users);

    // Clear cache to force refresh
    usersCache = null;

    return { ...users[userIndex] };
  }
};