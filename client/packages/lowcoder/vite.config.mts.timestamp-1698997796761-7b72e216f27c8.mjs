// vite.config.mts
import dotenv from "file:///Users/aiden/code/private/nebulous/client/node_modules/dotenv/lib/main.js";
import { defineConfig } from "file:///Users/aiden/code/private/nebulous/client/node_modules/vite/dist/node/index.js";
import react from "file:///Users/aiden/code/private/nebulous/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///Users/aiden/code/private/nebulous/client/node_modules/vite-tsconfig-paths/dist/index.mjs";
import svgrPlugin from "file:///Users/aiden/code/private/nebulous/client/node_modules/vite-plugin-svgr/dist/index.mjs";
import checker from "file:///Users/aiden/code/private/nebulous/client/node_modules/vite-plugin-checker/dist/esm/main.js";
import { visualizer } from "file:///Users/aiden/code/private/nebulous/client/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import path from "path";
import chalk from "file:///Users/aiden/code/private/nebulous/client/node_modules/chalk/source/index.js";
import { createHtmlPlugin } from "file:///Users/aiden/code/private/nebulous/client/node_modules/vite-plugin-html/dist/index.mjs";
import { ensureLastSlash } from "file:///Users/aiden/code/private/nebulous/client/packages/lowcoder-dev-utils/util.js";
import { buildVars } from "file:///Users/aiden/code/private/nebulous/client/packages/lowcoder-dev-utils/buildVars.js";
import { globalDepPlugin } from "file:///Users/aiden/code/private/nebulous/client/packages/lowcoder-dev-utils/globalDepPlguin.js";
var __vite_injected_original_dirname = "/Users/aiden/code/private/nebulous/client/packages/lowcoder";
dotenv.config();
var apiProxyTarget = process.env.LOWCODER_API_SERVICE_URL;
var nodeServiceApiProxyTarget = process.env.NODE_SERVICE_API_PROXY_TARGET;
var nodeEnv = process.env.NODE_ENV ?? "development";
var edition = process.env.REACT_APP_EDITION;
var isEEGlobal = edition === "enterprise-global";
var isEE = edition === "enterprise" || isEEGlobal;
var isDev = nodeEnv === "development";
var isVisualizerEnabled = !!process.env.ENABLE_VISUALIZER;
var browserCheckFileName = `browser-check-${process.env.REACT_APP_COMMIT_ID}.js`;
var base = ensureLastSlash(process.env.PUBLIC_URL);
if (!apiProxyTarget && isDev) {
  console.log();
  console.log(chalk.red`LOWCODER_API_SERVICE_URL is required.\n`);
  console.log(chalk.cyan`Start with command: LOWCODER_API_SERVICE_URL=\{backend-api-addr\} yarn start`);
  console.log();
  process.exit(1);
}
var proxyConfig = {
  "/api": {
    target: apiProxyTarget,
    changeOrigin: false
  }
};
if (nodeServiceApiProxyTarget) {
  proxyConfig["/node-service"] = {
    target: nodeServiceApiProxyTarget
  };
}
var define = {};
buildVars.forEach(({ name, defaultValue }) => {
  define[name] = JSON.stringify(process.env[name] || defaultValue);
});
var viteConfig = {
  define,
  assetsInclude: ["**/*.md"],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      "@lowcoder-ee": path.resolve(
        __vite_injected_original_dirname,
        isEE ? `../lowcoder/src/${isEEGlobal ? "ee-global" : "ee"}` : "../lowcoder/src"
      )
    }
  },
  base,
  build: {
    manifest: true,
    target: "es2015",
    cssTarget: "chrome63",
    outDir: "build",
    assetsDir: "static",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        chunkFileNames: "[hash].js"
      }
    },
    commonjsOptions: {
      defaultIsModuleExports: (id) => {
        if (id.indexOf("antd/lib") !== -1) {
          return false;
        }
        return "auto";
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#3377FF",
          "@link-color": "#3377FF",
          "@border-color-base": "#D7D9E0",
          "@border-radius-base": "4px"
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    open: true,
    cors: true,
    port: 8e3,
    host: "0.0.0.0",
    proxy: proxyConfig
  },
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint --quiet "./src/**/*.{ts,tsx}"',
        dev: {
          logLevel: ["error"]
        }
      }
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"]
        }
      }
    }),
    viteTsconfigPaths({
      projects: ["../lowcoder/tsconfig.json", "../lowcoder-design/tsconfig.json"]
    }),
    svgrPlugin({
      svgrOptions: {
        exportType: "named",
        prettier: false,
        svgo: false,
        titleProp: true,
        ref: true
      }
    }),
    globalDepPlugin(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          browserCheckScript: isDev ? "" : `<script src="${base}${browserCheckFileName}"></script>`
        }
      }
    }),
    isVisualizerEnabled && visualizer()
  ].filter(Boolean)
};
var browserCheckConfig = {
  ...viteConfig,
  define: {
    ...viteConfig.define,
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    ...viteConfig.build,
    manifest: false,
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      formats: ["iife"],
      name: "BrowserCheck",
      entry: "./src/browser-check.ts",
      fileName: () => {
        return browserCheckFileName;
      }
    }
  }
};
var buildTargets = {
  main: viteConfig,
  browserCheck: browserCheckConfig
};
var buildTarget = buildTargets[process.env.BUILD_TARGET || "main"];
var vite_config_default = defineConfig(buildTarget || viteConfig);
export {
  vite_config_default as default,
  viteConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FpZGVuL2NvZGUvcHJpdmF0ZS9uZWJ1bG91cy9jbGllbnQvcGFja2FnZXMvbG93Y29kZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9haWRlbi9jb2RlL3ByaXZhdGUvbmVidWxvdXMvY2xpZW50L3BhY2thZ2VzL2xvd2NvZGVyL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWlkZW4vY29kZS9wcml2YXRlL25lYnVsb3VzL2NsaWVudC9wYWNrYWdlcy9sb3djb2Rlci92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgU2VydmVyT3B0aW9ucywgVXNlckNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdml0ZVRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBzdmdyUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XG5pbXBvcnQgY2hlY2tlciBmcm9tIFwidml0ZS1wbHVnaW4tY2hlY2tlclwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWh0bWxcIjtcbmltcG9ydCB7IGVuc3VyZUxhc3RTbGFzaCB9IGZyb20gXCJsb3djb2Rlci1kZXYtdXRpbHMvdXRpbFwiO1xuaW1wb3J0IHsgYnVpbGRWYXJzIH0gZnJvbSBcImxvd2NvZGVyLWRldi11dGlscy9idWlsZFZhcnNcIjtcbmltcG9ydCB7IGdsb2JhbERlcFBsdWdpbiB9IGZyb20gXCJsb3djb2Rlci1kZXYtdXRpbHMvZ2xvYmFsRGVwUGxndWluXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3QgYXBpUHJveHlUYXJnZXQgPSBwcm9jZXNzLmVudi5MT1dDT0RFUl9BUElfU0VSVklDRV9VUkw7XG5jb25zdCBub2RlU2VydmljZUFwaVByb3h5VGFyZ2V0ID0gcHJvY2Vzcy5lbnYuTk9ERV9TRVJWSUNFX0FQSV9QUk9YWV9UQVJHRVQ7XG5jb25zdCBub2RlRW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPz8gXCJkZXZlbG9wbWVudFwiO1xuY29uc3QgZWRpdGlvbiA9IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9FRElUSU9OO1xuY29uc3QgaXNFRUdsb2JhbCA9IGVkaXRpb24gPT09IFwiZW50ZXJwcmlzZS1nbG9iYWxcIjtcbmNvbnN0IGlzRUUgPSBlZGl0aW9uID09PSBcImVudGVycHJpc2VcIiB8fCBpc0VFR2xvYmFsO1xuY29uc3QgaXNEZXYgPSBub2RlRW52ID09PSBcImRldmVsb3BtZW50XCI7XG5jb25zdCBpc1Zpc3VhbGl6ZXJFbmFibGVkID0gISFwcm9jZXNzLmVudi5FTkFCTEVfVklTVUFMSVpFUjtcbmNvbnN0IGJyb3dzZXJDaGVja0ZpbGVOYW1lID0gYGJyb3dzZXItY2hlY2stJHtwcm9jZXNzLmVudi5SRUFDVF9BUFBfQ09NTUlUX0lEfS5qc2A7XG5jb25zdCBiYXNlID0gZW5zdXJlTGFzdFNsYXNoKHByb2Nlc3MuZW52LlBVQkxJQ19VUkwpO1xuXG5pZiAoIWFwaVByb3h5VGFyZ2V0ICYmIGlzRGV2KSB7XG4gIGNvbnNvbGUubG9nKCk7XG4gIGNvbnNvbGUubG9nKGNoYWxrLnJlZGBMT1dDT0RFUl9BUElfU0VSVklDRV9VUkwgaXMgcmVxdWlyZWQuXFxuYCk7XG4gIGNvbnNvbGUubG9nKGNoYWxrLmN5YW5gU3RhcnQgd2l0aCBjb21tYW5kOiBMT1dDT0RFUl9BUElfU0VSVklDRV9VUkw9XFx7YmFja2VuZC1hcGktYWRkclxcfSB5YXJuIHN0YXJ0YCk7XG4gIGNvbnNvbGUubG9nKCk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn1cblxuY29uc3QgcHJveHlDb25maWc6IFNlcnZlck9wdGlvbnNbXCJwcm94eVwiXSA9IHtcbiAgXCIvYXBpXCI6IHtcbiAgICB0YXJnZXQ6IGFwaVByb3h5VGFyZ2V0LFxuICAgIGNoYW5nZU9yaWdpbjogZmFsc2UsXG4gIH0sXG59O1xuXG5pZiAobm9kZVNlcnZpY2VBcGlQcm94eVRhcmdldCkge1xuICBwcm94eUNvbmZpZ1tcIi9ub2RlLXNlcnZpY2VcIl0gPSB7XG4gICAgdGFyZ2V0OiBub2RlU2VydmljZUFwaVByb3h5VGFyZ2V0LFxuICB9O1xufVxuXG5jb25zdCBkZWZpbmUgPSB7fTtcbmJ1aWxkVmFycy5mb3JFYWNoKCh7IG5hbWUsIGRlZmF1bHRWYWx1ZSB9KSA9PiB7XG4gIGRlZmluZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52W25hbWVdIHx8IGRlZmF1bHRWYWx1ZSk7XG59KTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBjb25zdCB2aXRlQ29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICBkZWZpbmUsXG4gIGFzc2V0c0luY2x1ZGU6IFtcIioqLyoubWRcIl0sXG4gIHJlc29sdmU6IHtcbiAgICBleHRlbnNpb25zOiBbXCIubWpzXCIsIFwiLmpzXCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi50c3hcIiwgXCIuanNvblwiXSxcbiAgICBhbGlhczoge1xuICAgICAgXCJAbG93Y29kZXItZWVcIjogcGF0aC5yZXNvbHZlKFxuICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgIGlzRUUgPyBgLi4vbG93Y29kZXIvc3JjLyR7aXNFRUdsb2JhbCA/IFwiZWUtZ2xvYmFsXCIgOiBcImVlXCJ9YCA6IFwiLi4vbG93Y29kZXIvc3JjXCJcbiAgICAgICksXG4gICAgfSxcbiAgfSxcbiAgYmFzZSxcbiAgYnVpbGQ6IHtcbiAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICB0YXJnZXQ6IFwiZXMyMDE1XCIsXG4gICAgY3NzVGFyZ2V0OiBcImNocm9tZTYzXCIsXG4gICAgb3V0RGlyOiBcImJ1aWxkXCIsXG4gICAgYXNzZXRzRGlyOiBcInN0YXRpY1wiLFxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiW2hhc2hdLmpzXCIsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBkZWZhdWx0SXNNb2R1bGVFeHBvcnRzOiAoaWQpID0+IHtcbiAgICAgICAgaWYgKGlkLmluZGV4T2YoXCJhbnRkL2xpYlwiKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiYXV0b1wiO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBsZXNzOiB7XG4gICAgICAgIG1vZGlmeVZhcnM6IHtcbiAgICAgICAgICBcIkBwcmltYXJ5LWNvbG9yXCI6IFwiIzMzNzdGRlwiLFxuICAgICAgICAgIFwiQGxpbmstY29sb3JcIjogXCIjMzM3N0ZGXCIsXG4gICAgICAgICAgXCJAYm9yZGVyLWNvbG9yLWJhc2VcIjogXCIjRDdEOUUwXCIsXG4gICAgICAgICAgXCJAYm9yZGVyLXJhZGl1cy1iYXNlXCI6IFwiNHB4XCIsXG4gICAgICAgIH0sXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBvcGVuOiB0cnVlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgcG9ydDogODAwMCxcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICBwcm94eTogcHJveHlDb25maWcsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBjaGVja2VyKHtcbiAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgICBlc2xpbnQ6IHtcbiAgICAgICAgbGludENvbW1hbmQ6ICdlc2xpbnQgLS1xdWlldCBcIi4vc3JjLyoqLyoue3RzLHRzeH1cIicsXG4gICAgICAgIGRldjoge1xuICAgICAgICAgIGxvZ0xldmVsOiBbXCJlcnJvclwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGFyc2VyT3B0czoge1xuICAgICAgICAgIHBsdWdpbnM6IFtcImRlY29yYXRvcnMtbGVnYWN5XCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB2aXRlVHNjb25maWdQYXRocyh7XG4gICAgICBwcm9qZWN0czogW1wiLi4vbG93Y29kZXIvdHNjb25maWcuanNvblwiLCBcIi4uL2xvd2NvZGVyLWRlc2lnbi90c2NvbmZpZy5qc29uXCJdLFxuICAgIH0pLFxuICAgIHN2Z3JQbHVnaW4oe1xuICAgICAgc3Znck9wdGlvbnM6IHtcbiAgICAgICAgZXhwb3J0VHlwZTogXCJuYW1lZFwiLFxuICAgICAgICBwcmV0dGllcjogZmFsc2UsXG4gICAgICAgIHN2Z286IGZhbHNlLFxuICAgICAgICB0aXRsZVByb3A6IHRydWUsXG4gICAgICAgIHJlZjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgZ2xvYmFsRGVwUGx1Z2luKCksXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICBtaW5pZnk6IHRydWUsXG4gICAgICBpbmplY3Q6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGJyb3dzZXJDaGVja1NjcmlwdDogaXNEZXYgPyBcIlwiIDogYDxzY3JpcHQgc3JjPVwiJHtiYXNlfSR7YnJvd3NlckNoZWNrRmlsZU5hbWV9XCI+PC9zY3JpcHQ+YCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgaXNWaXN1YWxpemVyRW5hYmxlZCAmJiB2aXN1YWxpemVyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxufTtcblxuY29uc3QgYnJvd3NlckNoZWNrQ29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICAuLi52aXRlQ29uZmlnLFxuICBkZWZpbmU6IHtcbiAgICAuLi52aXRlQ29uZmlnLmRlZmluZSxcbiAgICBcInByb2Nlc3MuZW52Lk5PREVfRU5WXCI6IEpTT04uc3RyaW5naWZ5KFwicHJvZHVjdGlvblwiKSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAuLi52aXRlQ29uZmlnLmJ1aWxkLFxuICAgIG1hbmlmZXN0OiBmYWxzZSxcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGZvcm1hdHM6IFtcImlpZmVcIl0sXG4gICAgICBuYW1lOiBcIkJyb3dzZXJDaGVja1wiLFxuICAgICAgZW50cnk6IFwiLi9zcmMvYnJvd3Nlci1jaGVjay50c1wiLFxuICAgICAgZmlsZU5hbWU6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJyb3dzZXJDaGVja0ZpbGVOYW1lO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgYnVpbGRUYXJnZXRzID0ge1xuICBtYWluOiB2aXRlQ29uZmlnLFxuICBicm93c2VyQ2hlY2s6IGJyb3dzZXJDaGVja0NvbmZpZyxcbn07XG5cbmNvbnN0IGJ1aWxkVGFyZ2V0ID0gYnVpbGRUYXJnZXRzW3Byb2Nlc3MuZW52LkJVSUxEX1RBUkdFVCB8fCBcIm1haW5cIl07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhidWlsZFRhcmdldCB8fCB2aXRlQ29uZmlnKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVcs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
