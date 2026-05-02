// Type definitions for the logging middleware

export type Stack = "backend" | "frontend";
export type Level = "info" | "warn" | "error" | "fatal";

// Backend-only packages
export type BackendPackage =
  | "cache" | "controller" | "cron job" | "db" | "domain"
  | "handler" | "repository" | "route" | "service";

// Frontend-only packages
export type FrontendPackage =
  | "api" | "component" | "hook" | "page" | "state" | "style";

// Shared packages (both backend and frontend)
export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type Package = BackendPackage | FrontendPackage | SharedPackage;

export interface LoggerConfig {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}
