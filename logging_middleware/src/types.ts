/**
 * Type definitions for the Logging Middleware.
 * Enforces strict type-safety for all log parameters
 * as per the evaluation server constraints.
 */

/** Valid stack values — indicates which layer generated the log */
export type Stack = "backend" | "frontend";

/** Valid log severity levels — ordered by severity */
export type Level = "info" | "warn" | "error" | "fatal";

/** Packages usable exclusively in backend applications */
export type BackendPackage =
  | "cache"
  | "controller"
  | "cron job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

/** Packages usable exclusively in frontend applications */
export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

/** Packages usable in both backend and frontend applications */
export type SharedPackage =
  | "auth"
  | "config"
  | "middleware"
  | "utils";

/** Union of all valid package names */
export type Package = BackendPackage | FrontendPackage | SharedPackage;

/** Configuration required to initialize the logger */
export interface LoggerConfig {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

/** Shape of a successful log API response */
export interface LogResponse {
  logID: string;
  message: string;
}

/** Shape of the authentication token response */
export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}
