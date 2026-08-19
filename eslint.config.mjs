import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15 est encore au format eslintrc : FlatCompat le traduit
// pour ESLint 9. `next/core-web-vitals` embarque react, react-hooks et jsx-a11y.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [
      "out/**",
      ".next/**",
      "node_modules/**",
      "phudyka/**",
      ".impeccable/**",
      ".remember/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
