import * as jose from "jose";
import { User, UserResponse } from "../user/user.model";
import * as userRepo from "../user/user.repository";
import {
	JWT_SECRET,
	JWT_SECRET_REFRESH,
	TOKEN_EXPIRY,
	REFRESH_TOKEN_EXPIRY,
} from "../../utils/constants";

interface TokenPayload {
	userId: number;
	username: string;
	role: string;
}

interface Tokens {
	accessToken: string;
	refreshToken: string;
}

const secretBytes = (secret: string) => new TextEncoder().encode(secret);

export async function generateTokens(user: UserResponse): Promise<Tokens> {
	const payload = {
		userId: user.id,
		username: user.username,
		role: user.role,
	} as jose.JWTPayload;

	const jwtSecret = secretBytes(JWT_SECRET);
	const jwtRefreshSecret = secretBytes(JWT_SECRET_REFRESH);

	const accessToken = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(TOKEN_EXPIRY || "1h")
		.sign(jwtSecret);

	const refreshToken = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(REFRESH_TOKEN_EXPIRY || "7d")
		.sign(jwtRefreshSecret);

	return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
	const { payload } = await jose.jwtVerify(token, secretBytes(JWT_SECRET));
	return {
		userId: payload.userId as number,
		username: payload.username as string,
		role: payload.role as string,
	};
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
	const { payload } = await jose.jwtVerify(
		token,
		secretBytes(JWT_SECRET_REFRESH),
	);
	return {
		userId: payload.userId as number,
		username: payload.username as string,
		role: payload.role as string,
	};
}

export async function findUserById(
	userId: number,
): Promise<UserResponse | null> {
	return await userRepo.findUserById(userId);
}

export async function findUserByUsername(
	username: string,
): Promise<(User & { password: string }) | null> {
	return await userRepo.findUserByUsernameWithPassword(username);
}
