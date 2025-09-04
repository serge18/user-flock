import { User, Role, UpdateUserRolesRequest } from "@/types/user";

// Cache for parsed data
let usersCache: User[] | null = null;
let rolesCache: Role[] | null = null;

// Parse XML to get users
async function parseUsersXML(): Promise<User[]> {
  if (usersCache) return usersCache;
  
  const response = await fetch('/users.xml');
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const userElements = xmlDoc.getElementsByTagName('user');
  const users: User[] = [];
  
  for (let i = 0; i < userElements.length; i++) {
    const userElement = userElements[i];
    const id = userElement.getElementsByTagName('id')[0]?.textContent || '';
    const name = userElement.getElementsByTagName('name')[0]?.textContent || '';
    const email = userElement.getElementsByTagName('email')[0]?.textContent || '';
    
    const roleElements = userElement.getElementsByTagName('role');
    const roles: string[] = [];
    for (let j = 0; j < roleElements.length; j++) {
      const roleText = roleElements[j]?.textContent;
      if (roleText) roles.push(roleText);
    }
    
    users.push({ id, name, email, roles });
  }
  
  usersCache = users;
  return users;
}

// Parse XML to get roles
async function parseRolesXML(): Promise<Role[]> {
  if (rolesCache) return rolesCache;
  
  const response = await fetch('/roles.xml');
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const roleElements = xmlDoc.getElementsByTagName('role');
  const roles: Role[] = [];
  
  for (let i = 0; i < roleElements.length; i++) {
    const roleElement = roleElements[i];
    const id = roleElement.getElementsByTagName('id')[0]?.textContent || '';
    const name = roleElement.getElementsByTagName('name')[0]?.textContent || '';
    const description = roleElement.getElementsByTagName('description')[0]?.textContent || '';
    
    roles.push({ id, name, description });
  }
  
  rolesCache = roles;
  return roles;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getUsers(): Promise<User[]> {
    await delay(800); // Simulate network delay
    return await parseUsersXML();
  },

  async getRoles(): Promise<Role[]> {
    await delay(300);
    return await parseRolesXML();
  },

  async updateUserRoles(request: UpdateUserRolesRequest): Promise<User> {
    await delay(500);
    
    // Simulate occasional API failures for demo
    if (Math.random() < 0.1) {
      throw new Error("Failed to update user roles. Please try again.");
    }

    const users = await parseUsersXML();
    console.log('Available users:', users.map(u => ({ id: u.id, name: u.name })));
    console.log('Looking for user ID:', request.userId);
    
    const userIndex = users.findIndex(u => u.id === request.userId);
    if (userIndex === -1) {
      throw new Error(`User not found. Available users: ${users.map(u => u.id).join(', ')}`);
    }

    // Update cache
    if (usersCache) {
      usersCache[userIndex] = {
        ...usersCache[userIndex],
        roles: [...request.roles]
      };
      return { ...usersCache[userIndex] };
    }

    return {
      ...users[userIndex],
      roles: [...request.roles]
    };
  }
};