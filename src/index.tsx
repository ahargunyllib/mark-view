import { serve } from "bun";
import index from "./index.html";
import {
  validateRepository,
  getRepositoryFiles,
  getFileContent,
} from "./api/repository";
import { getRateLimit } from "./api/rate-limit";

const server = serve({
  routes: {
    // API Routes
    "/api/repository/validate": {
      POST: validateRepository,
    },
    "/api/repository/files": {
      POST: getRepositoryFiles,
    },
    "/api/repository/content": {
      POST: getFileContent,
    },
    "/api/rate-limit": {
      GET: getRateLimit,
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
