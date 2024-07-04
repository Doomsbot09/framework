import { Project, VariableDeclarationKind } from 'ts-morph'
import * as path from 'path'

// Function to generate Jest config file
export function generateJestConfig(project: Project, folderPath: string): void {
  const sourceFile = project.createSourceFile(path.join(folderPath, 'jest.config.cjs'), '', {
    overwrite: true,
  })

  sourceFile.addImportDeclaration({
    namedImports: [{ name: 'JestConfigWithTsJest' }],
    moduleSpecifier: 'ts-jest',
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'config',
        initializer: `{
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['./tests'],
        setupFiles: ['./tests/_mocks/mikro-orm-mock.ts'],
        transform: {
          '^.+\\\\.tsx?$': [
            'ts-jest',
            {
              isolatedModules: true,
            },
          ],
        },
      }`,
        type: 'JestConfigWithTsJest',
      },
    ],
  })

  sourceFile.addExportAssignment({
    expression: 'config',
    isExportEquals: false,
  })
  project.saveSync()
}
