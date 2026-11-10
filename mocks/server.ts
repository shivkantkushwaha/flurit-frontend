import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server instance for Node.js / Vitest test environments.
 */
export const server = setupServer(...handlers);
