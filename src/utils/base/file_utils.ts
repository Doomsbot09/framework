import * as fs from 'fs'
import * as path from 'path'
import { log } from './logger'
import { LogLevel } from '../enums/log_level'
import { FolderNodeInterface } from '../interfaces/cli/folder_node'

/**
 * Utility class for file system operations.
 */
export class FileUtils {
  /**
   * Ensures the existence of the directory path.
   * @param filePath - The file path for which to ensure directory existence.
   * @param overwriteIfExists - Whether to overwrite the directory if it exists (default: false).
   * @returns True if the directory exists or was successfully created; false otherwise.
   */
  static ensureDirectoryExistence(filePath: string, overwriteIfExists: boolean = false): boolean {
    const dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
      if (overwriteIfExists) {
        fs.rmdirSync(dirname, { recursive: true }) // Remove existing directory and contents
        fs.mkdirSync(dirname) // Recreate empty directory
      }
      return true
    } else {
      // Ensure existence of parent directory recursively
      this.ensureDirectoryExistence(dirname)
      fs.mkdirSync(dirname)
      return true // Directory created successfully
    }
  }

  /**
   * Reads the content of a file.
   * @param filePath - The path of the file to read.
   * @returns The content of the file as a string, or an empty string if an error occurs.
   */
  static readFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      log(LogLevel.ERROR, `Error reading file: ${filePath} ${error}`)
      return ''
    }
  }

  /**
   * Writes content to a file.
   * @param filePath - The path of the file to write.
   * @param content - The content to write to the file.
   */
  static writeFile(filePath: string, content: string): void {
    try {
      fs.writeFileSync(filePath, content, 'utf8')
      log(LogLevel.INFO, `File written successfully: ${filePath}`)
    } catch (error) {
      log(LogLevel.ERROR, `Error writing file: ${filePath} ${error}`)
    }
  }
  /**
   * Recursively creates folders based on the provided structure starting from a base directory.
   * @param baseDir - The base directory path where folders should be created.
   * @param structure - The structure defining folder names and optional nested children.
   * @returns A promise that resolves to true if successful, or false if an error occurs.
   */
  static async createFolders(baseDir: string, structure: FolderNodeInterface[]): Promise<boolean> {
    try {
      for (const item of structure) {
        const folderPath = path.join(baseDir, item.name)
        fs.mkdirSync(folderPath, { recursive: true })
        if (item.children && item.children.length > 0) {
          const success = await this.createFolders(folderPath, item.children) // Recursively create nested folders
          if (!success) {
            return false // If any nested folder creation fails, return false
          }
        }
      }
      return true
    } catch (error) {
      log(LogLevel.ERROR, `Error creating folders: ${error}`, true)
      return false
    }
  }
  static currentDir = process.cwd()
}
