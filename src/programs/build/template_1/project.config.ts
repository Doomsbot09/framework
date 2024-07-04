import { Project, VariableDeclarationKind } from 'ts-morph'
import * as path from 'path'

/**
 * Generates the project configuration file.
 * @param project - The ts-morph Project instance.
 * @param folderPath - The directory path where the config.ts file should be generated.
 */
export function generateProjectConfig(project: Project, folderPath: string): void {
  const sourceFile = project.createSourceFile(path.join(folderPath, 'project.config.ts'), '', {
    overwrite: true,
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'PROJECT_NAME',
        initializer: `"serff"`,
      },
      {
        name: 'SERVICE_NAME',
        initializer: `"user"`,
      },
    ],
    isExported: true,
  })

  sourceFile.formatText({ ensureNewLineAtEndOfFile: true })
  project.saveSync()
}
