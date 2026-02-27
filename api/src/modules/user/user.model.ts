export const ROLES = ["SUPERADMIN", "ADMIN", "USER"] as const;
export type Role = (typeof ROLES)[number];

export interface User {
	id: number;
	name: string;
	username: string;
	password: string;
	role: Role;
}

export interface UserCreateRequest {
	name: string;
	username: string;
	password: string;
	role: Role;
}

export interface UserUpdateRequest {
	id: number;
	name?: string;
	username?: string;
	password?: string;
	role?: Role;
}

export interface UserResponse {
	id: number;
	name: string;
	username: string;
	role: Role;
}
