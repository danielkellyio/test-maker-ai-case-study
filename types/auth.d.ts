// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: string;
    login: string;
    name: string;
    email: string;
    avatar: string;
  }

  // interface UserSession {
  //   // Add your own fields
  // }

  // interface SecureSessionData {
  //   // Add your own fields
  // }
}

export {};
