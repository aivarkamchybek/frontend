export interface User {
    userID: number;
    Username: string;
    Email: string;
    Password: string;
}

export interface LoginRequest {
    EmailOrUsername: string;
    Password: string;
  }