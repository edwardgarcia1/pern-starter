import express from "express";
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
} from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { attachAbility, authorize } from "../../middlewares/casl.middleware";
import { Action, Subject } from "../../casl/ability.factory";

const router = express.Router();

// Apply auth and CASL to all routes
router.use(authenticate);
router.use(attachAbility);

// Public read - anyone authenticated can read
router.route("/").get(authorize(Action.Read, Subject.User), getUsers);

// Only admins can create users
router.route("/").post(authorize(Action.Create, Subject.User), createUser);

// Users can only update their own profile, admins can update any
router
	.route("/:id")
	.patch(authorize(Action.Update, Subject.User, "id"), updateUser);

// Only admins can delete
router.route("/:id").delete(authorize(Action.Delete, Subject.User), deleteUser);

// Read by ID - users can read any user profile
router.route("/:id").get(authorize(Action.Read, Subject.User), getUserById);

export default router;
