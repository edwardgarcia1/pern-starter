import * as userRepo from "./user.repository";
import {
	Role,
	ROLES,
	UserCreateRequest,
	UserUpdateRequest,
} from "./user.model";
import bcrypt from "bcrypt";
import HttpError from "../../utils/http.error";

export function isValidRole(role: unknown): role is Role {
	return typeof role === "string" && ROLES.includes(role as Role);
}

export async function getUsers() {
	return await userRepo.findUsers();
}

export async function getUserById(id: number) {
	return await userRepo.findUserById(id);
}

export async function registerUser(dto: UserCreateRequest) {
	const existing = await userRepo.isUsernameTaken(dto.username);

	if (existing) {
		throw new HttpError("Username already registered", 409);
	}

	if (!isValidRole(dto.role)) {
		throw new HttpError("Invalid role", 400);
	}

	dto.password = await bcrypt.hash(dto.password, 10);

	return await userRepo.createUser(dto);
}

export async function patchUser(dto: UserUpdateRequest) {
	const existing = await userRepo.findUserById(dto.id);
	if (!existing) {
		throw new HttpError("User not found", 404);
	}
	if (dto.username) {
		const existing = await userRepo.isUsernameTaken(dto.username);
		if (existing) {
			throw new HttpError("Username already registered", 409);
		}
	}

	if (dto.role && !isValidRole(dto.role)) {
		throw new HttpError("Invalid role", 400);
	}

	if (dto.password) {
		dto.password = await bcrypt.hash(dto.password, 10);
	}

	return await userRepo.updateUser(dto);
}

export async function deleteUser(id: number) {
	const existing = await userRepo.findUserById(id);
	if (!existing) {
		throw new HttpError("User not found", 404);
	}

	return await userRepo.deleteUser(id);
}
