import {
  Project,
  StructureKind,
  OptionalKind,
  InterfaceDeclarationStructure,
  ImportDeclarationStructure,
} from "ts-morph";
import { capitalizeFirstLetter } from "../../utils/base/capitalize_first_letter";
import { getTypeNode } from "../../utils/base/get_type_node";
import {
  Template,
  Field,
} from "../../utils/interfaces/codegen/generate_interface";

export function generateBaseInterfaceCode(
  project: Project,
  template: Template,
  outputDir: string
): void {
  const { name, fields } = template.schema;

  const capitalizedSchemaName = capitalizeFirstLetter(name);

  const sourceFile = project.createSourceFile(
    `${outputDir}/${name.toLowerCase()}Interface.ts`,
    {},
    { overwrite: true }
  );

  const createInterfaceStructure = (
    interfaceName: string,
    fields: Field[]
  ): OptionalKind<InterfaceDeclarationStructure> => ({
    kind: StructureKind.Interface,
    name: interfaceName,
    isExported: true,
    properties: fields.map((field) => ({
      name: field.name,
      type: getTypeNode(field),
    })),
  });

  const baseInterface = createInterfaceStructure(
    `${capitalizedSchemaName}Interface`,
    fields
  );
  const createRequestInterface = createInterfaceStructure(
    `Create${capitalizedSchemaName}RequestInterface`,
    fields
  );
  const readResponseInterface = createInterfaceStructure(
    `Read${capitalizedSchemaName}ResponseInterface`,
    fields
  );
  const updateRequestInterface = createInterfaceStructure(
    `Update${capitalizedSchemaName}RequestInterface`,
    fields.map((field) => ({
      ...field,
      type: `${getTypeNode(field)} | undefined`,
    }))
  );
  const deleteResponseInterface: OptionalKind<InterfaceDeclarationStructure> = {
    kind: StructureKind.Interface,
    name: `Delete${capitalizedSchemaName}ResponseInterface`,
    isExported: true,
    properties: [
      {
        name: "message",
        type: "string",
      },
    ],
  };
  const paginatedInterface: OptionalKind<InterfaceDeclarationStructure> = {
    kind: StructureKind.Interface,
    name: `Paginated${capitalizedSchemaName}Interface`,
    isExported: true,
    properties: [
      { name: "page", type: "number" },
      { name: "pageSize", type: "number" },
      { name: "returnCount", type: "boolean | undefined" },
    ],
  };
  const paginatedResultInterface: OptionalKind<InterfaceDeclarationStructure> =
    {
      kind: StructureKind.Interface,
      name: `Paginated${capitalizedSchemaName}ResultInterface<T>`,
      isExported: true,
      properties: [
        { name: "records", type: "T[]" },
        { name: "total", type: "number | boolean | undefined" },
        { name: "page", type: "number" },
        { name: "pageSize", type: "number" },
      ],
    };
  const successResponseInterface: OptionalKind<InterfaceDeclarationStructure> =
    {
      kind: StructureKind.Interface,
      name: "SuccessResponseInterface<T>",
      isExported: true,
      properties: [
        { name: "data", type: "T" },
        { name: "message", type: "string" },
      ],
    };
  const errorResponseInterface: OptionalKind<InterfaceDeclarationStructure> = {
    kind: StructureKind.Interface,
    name: "ErrorResponseInterface",
    isExported: true,
    properties: [
      { name: "error", type: "string" },
      { name: "message", type: "string" },
    ],
  };

  const importDeclarations: ImportDeclarationStructure[] = [];

  // Generate schema files for fields of type "Schema"
  fields.forEach((field) => {
    if (field.type === "Schema" && field.fields) {
      const schemaInterfaceName = `${capitalizeFirstLetter(
        field.name
      )}Interface`;
      const schemaFields = field.fields.map((f) => ({
        name: f.name,
        type: getTypeNode(f),
      }));

      const schemaFile = project.createSourceFile(
        `${outputDir}/${field.name.toLowerCase()}Interface.ts`,
        {
          statements: [
            {
              kind: StructureKind.Interface,
              name: schemaInterfaceName,
              isExported: true,
              properties: schemaFields.map((f) => ({
                name: f.name,
                type: f.type,
              })),
            },
          ],
        },
        { overwrite: true }
      );

      schemaFile.saveSync();

      // Add import declaration for the schema interface
      const importDeclaration: ImportDeclarationStructure = {
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: `./${field.name.toLowerCase()}Interface`,
        namedImports: [schemaInterfaceName],
      };

      importDeclarations.push(importDeclaration);
    }
  });

  // Add all import declarations to source file
  sourceFile.addImportDeclarations(importDeclarations);

  // Add all interfaces to source file
  sourceFile.addInterfaces([
    baseInterface,
    createRequestInterface,
    readResponseInterface,
    updateRequestInterface,
    deleteResponseInterface,
    paginatedInterface,
    paginatedResultInterface,
    successResponseInterface,
    errorResponseInterface,
  ]);

  sourceFile.saveSync();
}
