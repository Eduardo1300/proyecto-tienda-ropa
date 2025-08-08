export interface UserPayload {
  sub: number;
  username: string;
  role?: string;
}

export interface RequestUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}
