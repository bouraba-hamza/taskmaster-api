import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Load the OpenAPI specification from the YAML file
const loadSwaggerDocument = () => {
  try {
    // Use path relative to project root, not compiled output
    const filePath = path.join(process.cwd(), 'src', 'docs', 'openapi.yaml');
    console.log('Loading OpenAPI spec from:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const document = yaml.load(fileContents);
    console.log('OpenAPI spec loaded successfully, paths:', Object.keys((document as any).paths || {}));
    return document;
  } catch (error) {
    console.error('Error loading OpenAPI specification:', error);
    // Fallback basic spec if file loading fails
    return {
      openapi: '3.0.0',
      info: {
        title: 'TaskMaster API',
        version: '1.0.0',
        description: 'A RESTful API for managing tasks',
      },
      paths: {},
    };
  }
};

export function swaggerSetup(app: Application) {
  const swaggerDocument = loadSwaggerDocument() as any;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}