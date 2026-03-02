import { Response, NextFunction } from "express";
import {
	Action,
	Subject,
	AppAbility,
	UserWithRole,
} from "../casl/ability.factory";
import { AuthenticatedRequest } from "./auth.middleware";
import { createAbility } from "../casl/ability.factory";
import HttpError from "../utils/http.error";

// Middleware to attach ability to request
export function attachAbility(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	if (req.user) {
		const ability = createAbility(req.user as UserWithRole);
		(req as any).ability = ability;
	}
	next();
}

// Factory function to create authorization middleware
export function authorize(action: Action, subject: Subject, field?: string) {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const ability: AppAbility = (req as any).ability;

		if (!ability) {
			return next(new HttpError("Authorization not configured", 500));
		}

		// For 'manage' action or checking subject
		const isAllowed = field
			? ability.can(action, subject, field)
			: ability.can(action, subject);

		if (!isAllowed) {
			return next(new HttpError("Forbidden: You don't have permission", 403));
		}

		next();
	};
}
