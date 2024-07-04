import { GeneratorOptionsInterface } from '../utils/interfaces/codegen/generate_interface'

/**
 * Default options for the code generator.
 */
const defaultOptions: GeneratorOptionsInterface = {
  outputDir: 'src/output',
  interfaceDir: 'src/output/handlers/interfaces',
  modelDir: 'src/output/handlers/models',
  httpDir: 'src/output/handlers/https',
  // Add default options here if needed
}

/**
 * Retrieves the current generator options.
 * You can modify this function to read options from environment variables or other sources.
 * @returns The current generator options as defined in `defaultOptions`.
 */
export function getGeneratorOptions(): GeneratorOptionsInterface {
  return defaultOptions
}

/**
 * Sets the generator options.
 * This function allows updating the default options with new values.
 * @param newOptions - Partial options to update the default options.
 */
export function setGeneratorOptions(newOptions: Partial<GeneratorOptionsInterface>): void {
  Object.assign(defaultOptions, newOptions)
}
