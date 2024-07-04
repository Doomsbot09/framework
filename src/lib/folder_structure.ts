import { FolderNodeInterface } from '../utils/interfaces/cli/folder_node'

/**
 * Template 1 representing a complex folder structure for an application.
 */
const template_1: FolderNodeInterface[] = [
  {
    name: 'app',
    children: [
      {
        name: 'controllers',
      },
      {
        name: 'emitters',
      },
      {
        name: 'handlers',
        children: [
          {
            name: '_interfaces',
          },
          {
            name: 'consumer',
          },
          {
            name: 'events',
          },
          {
            name: 'http',
            children: [
              {
                name: '_rules',
              },
            ],
          },
          {
            name: 'invocations',
          },
          {
            name: 'scheduler',
          },
        ],
      },
      {
        name: 'lib',
        children: [
          {
            name: 'commons',
          },
          {
            name: 'helpers',
          },
        ],
      },
      {
        name: 'models',
      },
      {
        name: 'repositories',
      },
      {
        name: 'services',
        children: [
          {
            name: 'aws',
          },
        ],
      },
    ],
  },
  {
    name: 'layers',
  },
  {
    name: 'test',
  },
]

/**
 * Template 3 representing a simpler folder structure.
 */
const template_3: FolderNodeInterface[] = [
  {
    name: 'parent1',
    children: [
      { name: 'handler', children: [] },
      { name: 'controller', children: [] },
    ],
  },
  {
    name: 'parent2',
    children: [{ name: 'child1', children: [] }],
  },
]

/**
 * Exports the predefined folder structures.
 */
export const folderStructure = {
  template_1,
  template_3,
}
