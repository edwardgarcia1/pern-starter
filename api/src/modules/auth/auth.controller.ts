import { Request, Response, NextFunction } from "express";
import * as jwtService from "./auth.service";
import * as userRepo from "../user/user.repository";
import bcrypt from "bcrypt";
import HttpError from "../../utils/http.error";
import {
	COOKIE_NAME,
	REFRESH_COOKIE_NAME,
	COOKIE_OPTIONS,
	REFRESH_COOKIE_OPTIONS,
} from "../../utils/constants";

interface LoginRequest {
	username: string;
	password: string;
}

export async function login(
	req: Request<unknown, unknown, LoginRequest>,
	res: Response,
	next: NextFunction,
) {
	try {
		const body = req.body || {};
		console.log("Received login request with body:", req.body);
		console.log("Login request body:", body);
		const { username, password } = body;

		if (!username || !password) {
			throw new HttpError("Username and password are required", 400);
		}

		const user = await userRepo.findUserByUsernameWithPassword(username);

		if (!user) {
			throw new HttpError("Invalid credentials", 401);
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			throw new HttpError("Invalid credentials", 401);
		}

		const tokens = await jwtService.generateTokens(user);

		res.cookie(COOKIE_NAME, tokens.accessToken, COOKIE_OPTIONS);
		res.cookie(
			REFRESH_COOKIE_NAME,
			tokens.refreshToken,
			REFRESH_COOKIE_OPTIONS,
		);

		res.json({
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				role: user.role,
			},
			accessToken: tokens.accessToken,
		});
	} catch (error) {
		next(error);
	}
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
	try {
		const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

		if (!refreshToken) {
			throw new HttpError("Refresh token not found", 401);
		}

		const payload = await jwtService.verifyRefreshToken(refreshToken);
		const user = await jwtService.findUserById(payload.userId);

		if (!user) {
			throw new HttpError("User not found", 401);
		}

		const tokens = await jwtService.generateTokens(user);

		res.cookie(COOKIE_NAME, tokens.accessToken, COOKIE_OPTIONS);
		res.cookie(
			REFRESH_COOKIE_NAME,
			tokens.refreshToken,
			REFRESH_COOKIE_OPTIONS,
		);

		res.json({ accessToken: tokens.accessToken });
	} catch (error) {
		if (error instanceof HttpError) {
			next(error);
		} else {
			next(new HttpError("Invalid or expired refresh token", 401));
		}
	}
}

export async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		res.clearCookie(COOKIE_NAME, { path: "/" });
		res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" });
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		next(error);
	}
}

export async function me(req: Request, res: Response, next: NextFunction) {
	try {
		const user = (req as any).user;
		res.json(user);
	} catch (error) {
		next(error);
	}
}
