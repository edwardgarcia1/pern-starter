import {
	AbilityBuilder,
	createMongoAbility,
	MongoAbility,
} from "@casl/ability";
import { UserResponse, Role } from "../modules/user/user.model";

export enum Action {
	Manage = "manage",
	Create = "create",
	Read = "read",
	Update = "update",
	Delete = "delete",
}

export enum Subject {
	User = "User",
	All = "all",
}

export type AppAbility = MongoAbility;

export type UserWithRole = UserResponse & { role: Role };

function defineAbilitiesFor(user: UserWithRole) {
	const { can, build } = new AbilityBuilder<MongoAbility>(createMongoAbility);

	switch (user.role) {
		case "SUPERADMIN":
			// Superadmin can do everything
			can(Action.Manage, Subject.All);
			break;

		case "ADMIN":
			// Admin can manage users but cannot manage other admins/superadmins
			can(Action.Manage, Subject.User);
			break;

		case "USER":
			// Regular user can only read all users and update their own profile
			can(Action.Read, Subject.User);
			can(Action.Update, Subject.User, ["id", "name"], { id: user.id });
			break;

		default:
			break;
	}

	return build();
}

export function createAbility(user: UserWithRole): AppAbility {
	return defineAbilitiesFor(user);
}
