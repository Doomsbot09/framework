import { Command } from 'commander'
import { log } from '../utils/base/logger'
import { LogLevel } from '../utils/enums/log_level'
import { FileUtils } from '../utils/base/file_utils'
import inquirer from 'inquirer'
import fs from 'fs'
import { spawnSync } from 'child_process'
import { generateEslintConfig } from '../programs/build/base/eslint.config'
import { generateGitIgnore } from '../programs/build/template_1/git.config'
import { generateReadme } from '../programs/build/template_1/readme.config'
import { generateTsconfig } from '../programs/build/base/typescript.config'
import { dependencies } from '../lib/templates/dependencies'
import { devDependencies } from '../lib/templates/dev_dependencies'
import { Project } from 'ts-morph'
import { generateJestConfig } from '../programs/build/template_1/jestInit.config'
import { generatePrettierConfig } from '../programs/build/base/prettierInit.config'
import { generateProjectConfig } from '../programs/build/template_1/project.config'

import ora from 'ora'
import path from 'path'

// USER DEFINED
import { notEmpty } from './validation'
import { PROJECT_TEMPLATE, DATABASES } from '../lib/list'
import { folderStructure } from '../lib/folder_structure'
import { FolderNodeInterface } from '../utils/interfaces/cli/folder_node'
import { ProjectTemplateItem, DatabaseItem } from '../utils/interfaces/cli/init_interface'
import { setGeneratorOptions } from '../config/generator_config'
import { generateSerffConfig } from '../programs/build/base/serff.app.config'

const program = new Command()

export class Action {
  static promptInit() {
    const questions = [
      {
        type: 'list',
        name: 'template',
        message: 'Create new serverless project with:',
        choices: PROJECT_TEMPLATE,
      },
      {
        type: 'list',
        name: 'database',
        message: 'Select database for this project:',
        choices: DATABASES,
      },
      {
        type: 'input',
        name: 'project_name',
        message: 'Create project name as?',
        when: () => !program.opts().project_name,
      },
    ]

    /**
     * Prompt the user for project details and generate the project structure accordingly.
     */
    inquirer.prompt(questions).then(async (answers) => {
      const answerProjectName: string = answers.project_name
      const projectNameIsValid: boolean = notEmpty(answerProjectName)

      const selectedTemplate: ProjectTemplateItem | undefined = PROJECT_TEMPLATE.find(
        (item: ProjectTemplateItem) => item.value === answers.template,
      )
      const selectedDatabase: DatabaseItem | undefined = DATABASES.find(
        (item: DatabaseItem) => item.value === answers.database,
      )

      const projectName: string = projectNameIsValid ? answerProjectName : 'new_project'
      const selectedStructure: FolderNodeInterface[] | undefined =
        folderStructure[answers.template as keyof typeof folderStructure]

      if (selectedStructure === undefined) {
        log(LogLevel.INFO, 'Template is not yet supported! Coming soon!!!')
        return false
      }

      console.log('\n')
      log(LogLevel.DEFAULT, `Project Name: ${projectName}`)
      log(LogLevel.DEFAULT, `Template: ${selectedTemplate?.name} ${answers.template}`)
      log(LogLevel.DEFAULT, `Database: ${selectedDatabase?.name}`)

      const spinner = ora(`Project creation started on ${projectName}`).start()
      const folderPath = path.join(FileUtils.currentDir, projectName)

      // Set generator options based on the selected template
      switch (answers.template) {
        case 'template_1':
          setGeneratorOptions({
            outputDir: folderPath,
            interfaceDir: `${folderPath}/app/handlers/_interfaces`,
            modelDir: `${folderPath}/app/models`,
            httpDir: `${folderPath}/app/handlers/http`,
          })
          break
        case 'template_3':
          setGeneratorOptions({
            outputDir: folderPath,
            interfaceDir: `${folderPath}/app/handlers/_interfaces`,
            modelDir: `${folderPath}/app/models`,
            httpDir: `${folderPath}/app/handlers/http`,
          })
          break
        default:
          setGeneratorOptions({
            outputDir: folderPath,
            interfaceDir: `${folderPath}/app/handlers/_interfaces`,
            modelDir: `${folderPath}/app/models`,
            httpDir: `${folderPath}/app/handlers/http`,
          })
          break
      }

      try {
        const success = await FileUtils.createFolders(folderPath, selectedStructure)
        if (success) {
          await this.initNode(folderPath)
          await this.generateProjectFiles(folderPath)
          // Generate serff configuration file
          generateSerffConfig(projectName, folderPath, answers.template, answers.database)
          log(LogLevel.SUCCESS, 'Setup completed successfully.')
          spinner.color = 'blue'
          spinner.succeed(' Process Completed!')
        } else {
          spinner.fail(' Process Failed..')
        }
      } catch (error: unknown) {
        log(
          LogLevel.ERROR,
          `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
        spinner.fail(' Process Failed..')
        log(LogLevel.INFO, `'Error initializing project: ${error}`)
        process.exit(1)
      }
    })
  }
  /**
   * Initializes an npm project in the specified directory if package.json does not exist.
   * Adds dependencies and devDependencies to package.json.
   * @param folderPath - The directory path where the npm project should be initialized.
   */
  static async initNode(folderPath: string): Promise<void> {
    const packageJsonPath = path.join(folderPath, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      log(LogLevel.INFO, `Initializing npm project in ${folderPath}...`, true)
      try {
        // Run `npm init -y` to initialize npm project with default values
        spawnSync('npm', ['init', '-y'], {
          stdio: 'inherit',
          cwd: folderPath,
          shell: true,
        })

        // Modify package.json to include dependencies and devDependencies
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        packageJson.dependencies = { ...dependencies }
        packageJson.devDependencies = { ...devDependencies }
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
        spawnSync('npm', ['install'], {
          stdio: 'inherit',
          cwd: folderPath,
          shell: true,
        })
        log(LogLevel.SUCCESS, 'Dependencies installed successfully.', true)
      } catch (error) {
        log(LogLevel.ERROR, `Error initializing npm project: ${error}`, true)
        throw new Error(`Failed to initialize npm project: ${error}`)
      }
    } else {
      log(LogLevel.INFO, `Package.json found in ${folderPath}. Skipping npm initialization.`, true)
    }
  }

  /**
   * Generates project configuration files in the specified directory.
   * Creates files: eslint.config.mjs, .gitignore, README.md, tsconfig.json
   * @param folderPath - The directory path where files should be generated.
   * @returns Promise<void> that resolves when all files are generated successfully or rejects on error.
   */
  static generateProjectFiles(folderPath: string): Promise<void> {
    const project: Project = new Project()
    return new Promise((resolve, reject) => {
      const parts = folderPath.split('/').filter(Boolean) // Split by '/' and remove empty parts
      const lastDir = parts[parts.length - 1] // Get the last directory
      const formattedName = lastDir.split('_').join(' ') // Remove underscores

      try {
        generateEslintConfig(project, folderPath)
        generateTsconfig(project, folderPath)
        generateJestConfig(project, folderPath)
        generatePrettierConfig(project, folderPath)
        generateGitIgnore(project, folderPath)
        generateProjectConfig(project, folderPath)
        generateReadme(project, folderPath, formattedName)
        project.save().then(() => {})
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}
