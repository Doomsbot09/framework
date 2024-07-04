import { Project } from 'ts-morph'
import * as path from 'path'

/**
 * Generates a prettier.config.cjs file with the specified Prettier configuration.
 * @param project - The ts-morph project instance.
 * @param folderPath - The directory path where the prettier.config.cjs file should be generated.
 */
export function generatePrettierConfig(project: Project, folderPath: string): void {
  const sourceFile = project.createSourceFile(path.join(folderPath, 'prettier.config.cjs'), '', {
    overwrite: true,
  })

  sourceFile.addStatements(`/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  format_on_save: true
};

module.exports = config;`)

  project.saveSync()
}
