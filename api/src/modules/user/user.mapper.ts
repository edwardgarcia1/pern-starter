import { User, UserResponse } from "./user.model";

export function toUserResponse(user: User): UserResponse {
	return {
		id: user.id,
		name: user.name,
		username: user.username,
		role: user.role,
	};
}

export function toUserResponseList(users: User[]): UserResponse[] {
	return users.map(toUserResponse);
}
