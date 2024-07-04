import { GenerateData } from './generate_data'

/**
 * Represents a CLI command item.
 */
export interface CommandInterface {
  name: string // Command name
  description: string // Command description
  alias: string // Command alias
  action: ((data?: GenerateData) => void) | (() => void) // Command action handler
}
