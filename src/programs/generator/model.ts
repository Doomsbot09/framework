import {
  Project,
  StructureKind,
  VariableDeclarationKind,
  OptionalKind,
  ImportDeclarationStructure,
} from "ts-morph";
import * as path from "path";
import { capitalizeFirstLetter } from "../../utils/base/capitalize_first_letter";
import { getTypeNode } from "../../utils/base/get_type_node";
import { Template } from "../../utils/interfaces/codegen/generate_interface";

export function generateBaseMongooseModel(
  project: Project,
  template: Template,
  outputDir: string
): void {
  const { name, fields } = template.schema;
  const capitalizedSchemaName = capitalizeFirstLetter(name);
  const fileName = `${name.toLowerCase()}.model.ts`;

  const schemaFields = fields.map((field) => {
    const typeNode = getTypeNode(field);
    let type;

    // Mapping field types to Mongoose types
    switch (typeNode) {
      case "string":
        type = "String";
        break;
      case "number":
        type = "Number";
        break;
      case "boolean":
        type = "Boolean";
        break;
      case "Date":
        type = "Date";
        break;
      case "Array<string>":
        type = "[String]";
        break;
      case "Array<number>":
        type = "[Number]";
        break;
      case "Array<boolean>":
        type = "[Boolean]";
        break;
      default:
        if (field.type === "Schema" && field.fields) {
          type = `${capitalizeFirstLetter(field.name)}Schema`;
        } else {
          type = typeNode;
        }
        break;
    }

    let initializer = `{ type: ${type}`;

    if (field.required) {
      initializer += ", required: true";
    }
    if (field.min !== undefined) {
      initializer += `, min: ${field.min}`;
    }
    if (field.max !== undefined) {
      initializer += `, max: ${field.max}`;
    }
    if (field.enum) {
      initializer += `, enum: ${JSON.stringify(field.enum)}`;
    }

    initializer += " }";

    return {
      name: field.name,
      initializer,
    };
  });

  const importDeclarations: OptionalKind<ImportDeclarationStructure>[] = [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "mongoose",
      namedImports: ["Schema", "model"],
    },
  ];

  const nestedSchemas = fields.filter(
    (field) => field.type === "Schema" && field.fields
  );

  nestedSchemas.forEach((nestedSchema) => {
    if (!nestedSchema.fields) return;

    const schemaInterfaceName = `${capitalizeFirstLetter(
      nestedSchema.name
    )}Schema`;
    const schemaFileName = `${nestedSchema.name.toLowerCase()}.model.ts`;

    importDeclarations.push({
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: `./${schemaFileName.replace(".ts", "")}`,
      defaultImport: schemaInterfaceName,
    });

    // Generate nested schema file
    const nestedSchemaFields = nestedSchema.fields.map((f) => {
      const nestedTypeNode = getTypeNode(f);
      let nestedType;

      switch (nestedTypeNode) {
        case "string":
          nestedType = "String";
          break;
        case "number":
          nestedType = "Number";
          break;
        case "boolean":
          nestedType = "Boolean";
          break;
        case "Date":
          nestedType = "Date";
          break;
        case "Array<string>":
          nestedType = "[String]";
          break;
        case "Array<number>":
          nestedType = "[Number]";
          break;
        case "Array<boolean>":
          nestedType = "[Boolean]";
          break;
        default:
          nestedType = nestedTypeNode;
          break;
      }

      let nestedInitializer = `{ type: ${nestedType}`;

      if (f.required) {
        nestedInitializer += ", required: true";
      }
      if (f.min !== undefined) {
        nestedInitializer += `, min: ${f.min}`;
      }
      if (f.max !== undefined) {
        nestedInitializer += `, max: ${f.max}`;
      }
      if (f.enum) {
        nestedInitializer += `, enum: ${JSON.stringify(f.enum)}`;
      }

      nestedInitializer += " }";

      return {
        name: f.name,
        initializer: nestedInitializer,
      };
    });

    const nestedSchemaSourceFile = project.createSourceFile(
      path.join(outputDir, schemaFileName),
      {
        statements: [
          {
            kind: StructureKind.ImportDeclaration,
            moduleSpecifier: "mongoose",
            namedImports: ["Schema"],
          },
          {
            kind: StructureKind.VariableStatement,
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
              {
                name: schemaInterfaceName,
                initializer: `new Schema({\n${nestedSchemaFields
                  .map((field) => `  ${field.name}: ${field.initializer}`)
                  .join(",\n")}\n})`,
              },
            ],
          },
          {
            kind: StructureKind.ExportAssignment,
            isExportEquals: false,
            expression: schemaInterfaceName,
          },
        ],
      },
      { overwrite: true }
    );

    nestedSchemaSourceFile.saveSync();
  });

  const sourceFile = project.createSourceFile(
    path.join(outputDir, fileName),
    {
      statements: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(importDeclarations.filter(Boolean) as any), // Ensuring no undefined entries
        {
          kind: StructureKind.VariableStatement,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `${capitalizedSchemaName}Schema`,
              initializer: `new Schema({\n${schemaFields
                .map((field) => `  ${field.name}: ${field.initializer}`)
                .join(",\n")}\n})`,
            },
          ],
        },
        {
          kind: StructureKind.ExportAssignment,
          isExportEquals: false,
          expression: `model('${name}s', ${capitalizedSchemaName}Schema)`,
        },
      ],
    },
    { overwrite: true }
  );

  sourceFile.saveSync();
}
