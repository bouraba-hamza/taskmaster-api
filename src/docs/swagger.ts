import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Load the OpenAPI specification from the YAML file and update server URLs
const loadSwaggerDocument = (req?: any) => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'docs', 'openapi.yaml');
    console.log('Loading OpenAPI spec from:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const document = yaml.load(fileContents) as any;
    
    // Dynamically set server URLs based on the request
    if (req) {
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
      const host = req.get('host') || 'localhost:3000';
      const baseUrl = `${protocol}://${host}`;
      
      document.servers = [
        { url: baseUrl, description: 'Current server' },
        { url: 'http://localhost:3000', description: 'Local development' }
      ];
    }
    
    console.log('OpenAPI spec loaded successfully, paths:', Object.keys(document.paths || {}));
    return document;
  } catch (error) {
    console.error('Error loading OpenAPI specification:', error);
    // Fallback spec...
  }
};

export function swaggerSetup(app: Application) {
  // Serve Swagger files
  app.use('/api-docs', swaggerUi.serve);
  
  // Setup Swagger with dynamic server URL
  app.get('/api-docs', (req, res, next) => {
    const swaggerDocument = loadSwaggerDocument(req) as any;
    swaggerUi.setup(swaggerDocument)(req, res, next);
  });
}