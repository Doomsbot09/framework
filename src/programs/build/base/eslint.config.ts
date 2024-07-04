import { Project } from 'ts-morph'
import * as path from 'path'

/**
 * Generates sample eslint.config.mjs content.
 * @returns Content for eslint.config.mjs file.
 */
export function generateEslintConfig(project: Project, folderPath: string): void {
  const sourceFile = project.createSourceFile(path.join(folderPath, 'eslint.config.mjs'), '', {
    overwrite: true,
  })

  sourceFile.addStatements(`export default {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  }
};`)

  project.saveSync()
}
