import "dotenv/config";

function getEnvVar(name: string): string {
	const value = process.env[name];
	if (!value || value.trim().length === 0) {
		throw new Error(`Environment variable ${name} is not defined or empty`);
	}
	return value;
}

export const PORT = getEnvVar("PORT");
export const ALLOWED_ORIGINS = getEnvVar("ALLOWED_ORIGINS")
	.split(",")
	.map((host) => host.trim());

export const database = getEnvVar("DB");
export const user = getEnvVar("DB_USER");
export const password = getEnvVar("DB_PASSWORD");
export const server = getEnvVar("DB_SERVER");
export const db_port = getEnvVar("DB_PORT");

// Environment Constants
export const JWT_SECRET = getEnvVar("JWT_SECRET");
export const JWT_SECRET_REFRESH = getEnvVar("JWT_SECRET_REFRESH");

export const COOKIE_NAME = process.env["COOKIE_NAME"] || "token";
export const REFRESH_COOKIE_NAME =
	process.env["REFRESH_COOKIE_NAME"] || "refresh_token";

// Token Expiry Settings
export const TOKEN_EXPIRY = process.env["TOKEN_EXPIRY"] || "30m"; // 30 minutes
export const REFRESH_TOKEN_EXPIRY = process.env["REFRESH_TOKEN_EXPIRY"] || "7d"; // 30 days

// Refresh token expiration (in seconds for jose)
export const TOKEN_EXPIRY_SEC =
	parseInt(process.env["TOKEN_EXPIRY_SECONDS"] || "1800") || 1000 * 60 * 30; // 30m
export const REFRESH_TOKEN_EXPIRY_SEC =
	parseInt(process.env["REFRESH_TOKEN_EXPIRY_SECONDS"] || "604800") ||
	1000 * 60 * 60 * 24 * 7; // 7d

const isProd = process.env.NODE_ENV === "production";

// Cookie Settings
export const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: isProd,
	sameSite: "lax" as const,
	path: "/",
	maxAge: TOKEN_EXPIRY_SEC,
};

export const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: isProd,
	sameSite: "lax" as const,
	path: "/",
	maxAge: REFRESH_TOKEN_EXPIRY_SEC,
};
