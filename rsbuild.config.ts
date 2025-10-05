import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { resolve } from "path";
import { app } from "./src/server/app.dev";
import { getRequestListener } from "@hono/node-server";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 8989,
    proxy: {
      // 代理微信小程序API请求，避免CORS问题
      '/api/wx': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        pathRewrite: {
          '^/api/wx': '/common/wx',
        },
      },
    },
  },
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  output: {
    distPath: {
      root: "dist/web",
    },
    legalComments: "none",
  },
  dev: {
    watchFiles: {
      paths: ["./src/server"],
      type: "reload-server",
    },
    setupMiddlewares: [
      (middlewares) => {
        middlewares.unshift((req, res, next) => {
          if (req.url?.startsWith("/api")) {
            const listener = getRequestListener(app.fetch);
            listener(req, res);
          } else {
            next();
          }
        });
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
