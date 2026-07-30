import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  });
export default defineConfig([
  globalIgnores([".angular", "nxcache", "node_modules", "dist", "coverage", ".github", ".vscode", "scripts", "/angular.json", "docs/**/*.md", "lib/js-api/docs/**/*.md", ".storybook", "webpack.config.js", "lib/core/src/lib/icon", "*.log", "node_modules", "bundles", ".idea/", "*.iml", ".env.*", ".env", "dist", "tmp", "temp", ".history", ".ng_pkg_build/", "coverage/", "out-tsc", "/reports/", "e2e-result-*", "licenses.txt", ".DS_Store", "desktop.ini", ".angular", ".nx", "nxcache", ".husky", ".cursor/rules/nx-rules.mdc", ".github/instructions/nx.instructions.md", "lib/eslint-angular/dist/"]),
  {
    extends: fixupConfigRules(compat.extends(
      "./.eslintrc.js"
    )),
  }
]);
