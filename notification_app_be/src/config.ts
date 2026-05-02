// Loads credentials from .env file for the backend app

import { LoggerConfig } from "logging-middleware";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const CONFIG: LoggerConfig = {
  email: process.env.EMAIL || "",
  name: process.env.NAME || "",
  rollNo: process.env.ROLL_NO || "",
  accessCode: process.env.ACCESS_CODE || "",
  clientID: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",
};

export const BASE_URL = process.env.BASE_URL || "http://20.207.122.201/evaluation-service";
