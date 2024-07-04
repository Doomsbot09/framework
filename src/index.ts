#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()

import { COMMANDS } from './core/command'
import { Banner } from './lib/banner'
import { GenerateData } from './utils/interfaces/cli/generate_data'
import { CommandInterface } from './utils/interfaces/cli/command_interface'

Banner('Serff')

program
  .name('serff')
  .version('1.0.0', '-v, --version', 'output the version number')
  .usage('[options] [command]')
  .helpOption('-h, --help', 'display help for command')

COMMANDS.forEach((item: CommandInterface) => {
  program
    .command(item.name)
    .description(item.description)
    .alias(item.alias)
    .action((data: GenerateData) => {
      item.action(data)
    })
})

// Override helpInformation method to customize help output
program.helpInformation = function () {
  return [
    'Usage:'.cyan,
    `  serff ${'[options]'.yellow} ${'[command]'.yellow}`,
    '',
    'Options:'.cyan,
    `  ${'-V, --version'.yellow}           ${'output the version number'.white}`,
    `  ${'-h, --help'.yellow}              ${'display help for command'.white}`,
    '',
    'Commands:'.cyan,
    `  ${'serff run'}                                [alias: r]       ${
      'Serves serverless as offline'.white
    } `,
    `  ${'serff deploy'}                             [alias: d]       ${'Deploys project.'.white}`,
    `  ${'serff build'}                              [alias: b]       ${'Build project.'.white}`,
    `  ${'serff test'}                               [alias: t]       ${
      'Runs unit test on the project'.white
    }`,
    `  ${'serff generate <component|model> --name'}  [alias: g]       ${
      'Generates files or schema.'.white
    }`,
    `  ${'init'}                                     [alias: i]       ${
      'Create Your Serverless Project With Template'.white
    }`,
    `  ${'help [command]'}                                            ${
      'display help for command'.white
    }`,
    '',
  ].join('\n')
}

program.parse(process.argv)
