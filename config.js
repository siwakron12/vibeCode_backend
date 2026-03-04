import dotenv from "dotenv";

dotenv.config();

const portEnv = process.env.PORT;
const parsedPort = portEnv ? parseInt(portEnv, 10) : undefined;

export const config = {
  port: Number.isNaN(parsedPort) || parsedPort == null ? 4000 : parsedPort,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
