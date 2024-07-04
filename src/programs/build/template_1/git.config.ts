import { Project } from 'ts-morph'

/**
 * Generates sample .gitignore content.
 * @param project - The ts-morph Project instance.
 * @param folderPath - The directory path where .gitignore should be generated.
 * @returns Content for .gitignore file.
 */
export function generateGitIgnore(project: Project, folderPath: string): void {
  project.createSourceFile(
    `${folderPath}/.gitignore`,
    `# Ignore node_modules folder
    node_modules
    
    # Ignore build files
    .build
    dist
    `,

    {
      overwrite: true,
    },
  )
  project.saveSync()
}
