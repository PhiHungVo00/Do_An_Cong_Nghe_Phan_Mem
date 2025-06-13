export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '0123456789',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Normal User',
    phone: '0987654321',
  },
]; 