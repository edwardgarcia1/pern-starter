import { Request, Response, NextFunction } from "express";
import * as jwtService from "../modules/auth/auth.service";
import { COOKIE_NAME } from "../utils/constants";
import HttpError from "../utils/http.error";
import { UserResponse } from "../modules/user/user.model";

export interface AuthenticatedRequest extends Request {
	user?: UserResponse;
}

export async function authenticate(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const token =
			req.cookies[COOKIE_NAME] ||
			req.headers.authorization?.replace("Bearer ", "");

		if (!token) {
			throw new HttpError("Authentication required", 401);
		}

		const payload = await jwtService.verifyAccessToken(token);
		const user = await jwtService.findUserById(payload.userId);

		if (!user) {
			throw new HttpError("User not found", 401);
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof HttpError) {
			next(error);
		} else {
			next(new HttpError("Invalid or expired token", 401));
		}
	}
}
