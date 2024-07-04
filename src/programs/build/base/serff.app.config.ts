import path from 'path'
import fs from 'fs'
import { getGeneratorOptions } from '../../../config/generator_config'

/**
 * Generates serff configuration file based on user input and writes it to the specified folder path.
 * The configuration includes project details, selected template, database, and generator options.
 * @param projectName - Name of the project.
 * @param folderPath - Path where the configuration file should be saved.
 * @param template - Selected template for the project.
 * @param database - Selected database for the project.
 */
export function generateSerffConfig(
  projectName: string,
  folderPath: string,
  template: string,
  database: string,
): void {
  // Construct the configuration object
  const config = {
    projectName,
    template,
    database,
    generatorOptions: getGeneratorOptions(),
  }

  // Serialize the configuration object to JSON with single quotes only around string values
  const jsonConfig = JSON.stringify(config, null, 2)
    // Replace quotes around string values with single quotes
    .replace(/"([^"]+)":\s*"([^"]+)"/g, "$1: '$2'")
    // Replace remaining quotes (around non-string values like numbers and booleans)
    .replace(/"([^"]+)"(?=:)/g, '$1')

  // Generate the content for serff.app.config.ts
  const fileContent = `
//    _________              _____  _____
//   /   _____/ ____________/ ____\\/ ____\\
//  \\_____  \\_/ __ \\_  __ \\   __\\\\  __\\
//   /        \\  ___/|  | \\/|  |   |  |
//  /_______  /\\___  >__|   |__|   |__|
//          \\/     \\/
//  This document is programmatically generated. Don't edit as it may cause issues.

/**
 * serff Configuration File
 *
 * This file contains configuration settings for the serff application.
 */

/**
 * Project Configuration
 *
 * Defines project-specific settings.
 */


/**
 * ¯\\_(ツ)_/¯
 */

export const serffConfig = ${jsonConfig};
`

  // Write the configuration content to the specified file
  fs.writeFileSync(path.join(folderPath, 'serff.app.config.ts'), fileContent, 'utf8')
}
