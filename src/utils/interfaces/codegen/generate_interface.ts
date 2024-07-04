/**
 * Options for configuring the generator.
 */
export interface GeneratorOptionsInterface {
  outputDir: string; // Directory where generated files will be outputted
  interfaceDir: string; // Directory for generated interface files
  modelDir: string; // Directory for generated model files
  httpDir: string; // Directory for HTTP-related files (e.g., API endpoints)
  // Add more options as needed
}

/**
 * Represents a field in a schema or template.
 */
export interface Field {
  name: string; // Name of the field
  type: string; // Type of the field
  required?: boolean; // Whether the field is required
  min?: number; // Optional minimum value (applicable for numeric types)
  max?: number; // Optional maximum value (applicable for numeric types)
  enum?: string[]; // Optional array of enum values (applicable for string types)
  items?: Field; // Optional field for Array items (nested fields)
  fields?: Field[]; // Optional field for Object fields (nested fields)
}

/**
 * Represents a schema containing fields.
 */
export interface Schema {
  name: string; // Name of the schema
  fields: Field[]; // Array of fields within the schema
}

/**
 * Represents data with a name.
 */
export interface Data {
  name: string; // Name associated with the data
}

/**
 * Represents a template with a name, fields, and schema.
 */
export interface Template {
  name: string; // Name of the template
  fields: Field[]; // Array of fields defined in the template
  schema: Schema; // Schema associated with the template
}
