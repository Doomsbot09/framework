import { log } from '../utils/base/logger'
import { LogLevel } from '../utils/enums/log_level'
import { CommandInterface } from '../utils/interfaces/cli/command_interface'
import { GenerateData } from '../utils/interfaces/cli/generate_data'
import { Action } from './action'

export const COMMANDS: CommandInterface[] = [
  {
    name: 'run',
    description: 'Serves serverless as offline',
    alias: 'r',
    action: () => {
      log(LogLevel.SUCCESS, 'Serverless offline is now running on port 3001.')
    },
  },
  {
    name: 'deploy',
    description: 'Deploys project.',
    alias: 'd',
    action: () => {
      log(LogLevel.INFO, 'Serverless deploying on --region ap-east-1 --stage dev.')
    },
  },
  {
    name: 'build',
    description: 'Build project.',
    alias: 'b',
    action: () => {
      log(LogLevel.SUCCESS, 'Serverless build successful.')
    },
  },
  {
    name: 'test',
    description: 'Runs unit test on the project',
    alias: 't',
    action: () => {
      log(LogLevel.SUCCESS, 'Test 10/10 success.')
    },
  },
  {
    name: 'generate <component>',
    description: 'Generates files or schema.',
    alias: 'g',
    action: (data: GenerateData | undefined) => {
      if (data != undefined) {
        log(LogLevel.SUCCESS, `Successfully generated ${data.component}`)
      }
    },
  },
  {
    name: 'init',
    description: 'Create Your Serverless Project With Template',
    alias: 'i',
    action: () => {
      Action.promptInit()
    },
  },
]
