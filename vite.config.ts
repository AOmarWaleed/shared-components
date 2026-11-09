import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      dts({
        entryRoot: 'src',
        outDir: 'dist/types',
        rollupTypes: true,
        insertTypesEntry: true,
      }),
    ],
    build: {
      outDir: "dist",
      sourcemap: true, // Move sourcemap here
      minify: 'esbuild',
      cssCodeSplit: true,
      lib: {
        entry: resolve(__dirname, "src/index.tsx"),
        name: "galaxy-shared-components",
        fileName: (format) => `index.${format}.js`,
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        // IMPORTANT: Externalize ALL peer dependencies
        external: [
          // React
          "react",
          "react-dom",
          "react/jsx-runtime",
          
          // MUI Core
          "@mui/material",
          "@mui/material/styles",
          "@mui/icons-material",
          "@mui/x-data-grid",
          "@mui/x-date-pickers",
          "@mui/lab",
          
          // Emotion
          "@emotion/react",
          "@emotion/styled",
          "@emotion/react/jsx-runtime",
          
          // Utilities
          "date-fns",
          "dayjs",
          "lodash",
          "lodash.debounce",

          // Formik
          "formik"
        ],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "@mui/material": "MaterialUI",
            "@mui/icons-material": "MaterialUIIcons",
            "@mui/x-data-grid": "DataGrid",
            "@mui/x-date-pickers": "XDatePickers",
            "@emotion/react": "emotionReact",
            "@emotion/styled": "emotionStyled",
            "date-fns": "dateFns",
            "lodash": "_",
          },
          // Preserve module structure
          preserveModules: false,
          exports: 'named',
          // Ensure proper interop
          interop: 'auto',
        },
      },
    },
    server: {
      proxy: {
        "/billing-api": {
          target: env.ABSOLUTE_BILLING_URL,
          changeOrigin: true,
         
        },
        "/nphies-api": {
          target: env.ABSOLUTE_NPHIES_URL,
          changeOrigin: true,
          
        },
      },
      port: Number(env.PORT) || 3500,
      allowedHosts: true,
      cors: true,
    },
    // Ensure proper module resolution
    resolve: {
      alias: {
        '@emotion/react': resolve(__dirname, 'node_modules/@emotion/react'),
        '@emotion/styled': resolve(__dirname, 'node_modules/@emotion/styled'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        '@mui/x-data-grid',
        '@emotion/react',
        '@emotion/styled',
        'date-fns',
        'dayjs',
        'lodash',
      ],
    },
  };
});