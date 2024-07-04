import { Project, VariableDeclarationKind } from 'ts-morph'
import * as path from 'path'

/**
 * Generates the serverless configuration file.
 * @param project - The ts-morph Project instance.
 * @param folderPath - The directory path where the serverless.config.ts file should be generated.
 */
export function generateServerlessConfig(project: Project, folderPath: string): void {
  const sourceFile = project.createSourceFile(path.join(folderPath, 'serverless.yml'), '', {
    overwrite: true,
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'SERVERLESS_CONFIG',
        initializer: `{
          service: 'my-service',
          provider: {
            name: 'aws',
            runtime: 'nodejs14.x',
            region: 'us-east-1',
          },
          functions: {
            hello: {
              handler: 'src/handlers/hello.handler',
              events: [
                { http: { method: 'get', path: 'hello' } }
              ]
            }
          }
        }`,
        type: 'any',
      },
    ],
    isExported: true,
  })

  sourceFile.formatText({ ensureNewLineAtEndOfFile: true })
  project.saveSync()
}
