import { Project } from 'ts-morph'

/**
 * Generates sample README.md content.
 * @param project - The ts-morph Project instance.
 * @param folderPath - The directory path where README.md should be generated.
 * @param projectName - The name of the project.
 * @returns Content for README.md file.
 */
export function generateReadme(project: Project, folderPath: string, projectName: string): void {
  const readmeContent = `# ${(projectName ?? 'Project Name').toUpperCase()}
  
  Project description goes here.`

  project.createSourceFile(`${folderPath}/README.md`, readmeContent, {
    overwrite: true,
  })

  project.saveSync()
}
