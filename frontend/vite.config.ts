import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Environment variables loaded:", {
    VITE_API_URL: env.VITE_API_URL || "Not defined",
  });

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
    },
    // Add clear error overlay
    clearScreen: false,
    // Enable more detailed logs
    logLevel: "info",
    // Define environment variables
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:8000"
      ),
    },
  };
});
