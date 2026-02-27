import { Request, Response } from "express";
import * as userService from "./user.service";

export async function getUsers(req: Request, res: Response) {
	const users = await userService.getUsers();
	res.json(users);
}

export async function getUserById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const user = await userService.getUserById(id);
	res.json(user);
}

export async function createUser(req: Request, res: Response) {
	const user = await userService.registerUser(req.body);
	res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
	const id = Number(req.params.id);
	const user = await userService.patchUser({ id, ...req.body });
	res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
	const id = Number(req.params.id);
	const deletedUser = await userService.deleteUser(id);
	res.status(200).json(deletedUser);
}
