// Next.js 16 ships native ESLint flat config — no FlatCompat needed.
// `core-web-vitals` already includes the base rules, the TypeScript parser,
// and jsx-a11y accessibility rules.
import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...next,
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      "node_modules/**",
      "public/**",
      "scripts/**",
    ],
  },
];

export default eslintConfig;
