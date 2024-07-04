import { Field } from "../interfaces/codegen/generate_interface";
import { capitalizeFirstLetter } from "./capitalize_first_letter";

/**
 * Retrieves the TypeScript type node corresponding to a given field definition.
 * @param field The field definition containing type information.
 * @returns The TypeScript type node as a string.
 */
export function getTypeNode(field: Field): string {
  switch (field.type.toLowerCase()) {
    case "string":
    case "number":
    case "boolean":
      return field.type.toLowerCase();
    case "array":
      if (field.items && field.items.type) {
        const itemType = getTypeNode(field.items);
        return `${itemType}[]`;
      } else {
        return "any[]"; // Fallback for unknown array types
      }
    case "object":
      if (field.fields) {
        const properties = field.fields
          .map((f) => `${f.name}: ${getTypeNode(f)}`)
          .join(", ");
        return `{ ${properties} }`;
      }
      break;
    case "schema":
      return `${capitalizeFirstLetter(field.name)}Interface`;
    default:
      return field.type;
  }
  return ""; // Default return statement, although not expected to reach this point
}
