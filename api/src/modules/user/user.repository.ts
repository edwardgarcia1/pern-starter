import { executeQuery } from "../../utils/query";
import {
	UserResponse,
	UserCreateRequest,
	UserUpdateRequest,
} from "./user.model";

export async function findUsers(): Promise<UserResponse[]> {
	const result = await executeQuery(
		`SELECT id, name, username, password, role
        FROM users`,
		[],
	);
	return result.rows;
}

export async function findUserById(id: number): Promise<UserResponse | null> {
	const result = await executeQuery(
		`SELECT id, name, username, password, role
        FROM users
        WHERE id = $1`,
		[id],
	);

	return result.rows[0] ?? null;
}

export async function findUserbyUsername(
	username: string,
): Promise<UserResponse | null> {
	const result = await executeQuery(
		`SELECT id, name, username, password, role
        FROM users
        WHERE username = $1`,
		[username],
	);

	return result.rows[0] ?? null;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
	const result = await executeQuery(
		`SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`,
		[username],
	);
	return result.rows[0].exists;
}

export async function createUser(
	request: UserCreateRequest,
): Promise<UserResponse> {
	const result = await executeQuery(
		`
        INSERT INTO users (name, username, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, username, role
        `,
		[request.name, request.username, request.password, request.role],
	);

	return result.rows[0];
}

export async function updateUser(
	request: UserUpdateRequest,
): Promise<UserResponse> {
	const result = await executeQuery(
		`
		UPDATE users
        SET 
			name = COALESCE($2, name),
            username = COALESCE($3, username),
            password = COALESCE($4, password),
			role = COALESCE($5, role)
        WHERE id = $1
        RETURNING id, name, username, role
		`,
		[
			request.id,
			request.name,
			request.username,
			request.password,
			request.role,
		],
	);
	return result.rows[0];
}

export async function deleteUser(id: number): Promise<UserResponse> {
	const result = await executeQuery(
		`
		DELETE FROM users
        WHERE id = $1
        RETURNING id, name, username, role
		`,
		[id],
	);
	return result.rows[0];
}
